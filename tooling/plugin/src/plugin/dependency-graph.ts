import { importree, getAffectedFiles } from "importree";
import type { ImportTree, ImportEdge } from "importree";

export interface DependencyGraph {
	trackedFiles: Set<string>;
	entryTrees: Map<string, ImportTree>;
	mergedTree: ImportTree | null;
}

export function createDependencyGraph(): DependencyGraph {
	return {
		trackedFiles: new Set(),
		entryTrees: new Map(),
		mergedTree: null,
	};
}

/**
 * Build the dependency graph from all entry points (config + styleframe files).
 * Each entry point gets its own ImportTree, then all trees are merged into
 * a combined forward/reverse graph for cross-entry dependency tracking.
 */
export async function buildDependencyGraph(
	configPath: string,
	styleframeFiles: Array<string>,
	aliases?: Record<string, string>,
): Promise<DependencyGraph> {
	const graph = createDependencyGraph();
	const allEntries = [configPath, ...styleframeFiles];

	for (const entry of allEntries) {
		try {
			const tree = await importree(entry, aliases ? { aliases } : undefined);
			graph.entryTrees.set(entry, tree);

			for (const file of tree.files) {
				graph.trackedFiles.add(file);
			}
		} catch {
			// If importree fails for an entry (e.g. syntax error),
			// still track the entry itself
			graph.trackedFiles.add(entry);
		}
	}

	graph.mergedTree = mergeImportTrees([...graph.entryTrees.values()]);

	return graph;
}

function mergeImportTrees(trees: Array<ImportTree>): ImportTree {
	const files = new Set<string>();
	const graph: Record<string, Array<ImportEdge>> = {};
	const reverseGraph: Record<string, Array<ImportEdge>> = {};
	const externals = new Set<string>();

	for (const tree of trees) {
		for (const file of tree.files) {
			files.add(file);
		}
		for (const [key, edges] of Object.entries(tree.graph)) {
			const existing = graph[key] ?? [];
			for (const edge of edges) {
				if (!existing.some((e) => e.path === edge.path)) {
					existing.push(edge);
				}
			}
			graph[key] = existing;
		}
		for (const [key, edges] of Object.entries(tree.reverseGraph)) {
			const existing = reverseGraph[key] ?? [];
			for (const edge of edges) {
				if (!existing.some((e) => e.path === edge.path)) {
					existing.push(edge);
				}
			}
			reverseGraph[key] = existing;
		}
		for (const ext of tree.externals) {
			externals.add(ext);
		}
	}

	return {
		entrypoint: trees[0]?.entrypoint ?? "",
		files: [...files],
		graph,
		reverseGraph,
		externals: [...externals],
	};
}

/**
 * Find all files that need to be invalidated from the Jiti cache
 * when a file changes. Returns the changed file plus all its
 * transitive dependents (BFS on reverse graph).
 */
export function getFilesToInvalidate(
	depGraph: DependencyGraph,
	changedFile: string,
): Array<string> {
	if (!depGraph.mergedTree) {
		return [changedFile];
	}

	return [changedFile, ...getAffectedFiles(depGraph.mergedTree, changedFile)];
}

/**
 * Check if a file is a tracked dependency (in the graph but not
 * a config file or styleframe file). These are shared composables,
 * theme utilities, etc.
 */
export function isTrackedDependency(
	depGraph: DependencyGraph,
	filePath: string,
	configPath: string,
	styleframeFiles: Map<string, unknown>,
): boolean {
	return (
		depGraph.trackedFiles.has(filePath) &&
		filePath !== configPath &&
		!styleframeFiles.has(filePath)
	);
}
