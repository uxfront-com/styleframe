<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { Component } from "vue";
import {
	ChevronDown,
	ChevronRight,
	File,
	FileCode,
	FileCog,
	FilePlus,
	Folder,
	FolderOpen,
	FolderPlus,
	MoreHorizontal,
	Palette,
} from "lucide-vue-next";
import {
	pgFileTabDot,
	pgFileTree,
	pgFileTreeAction,
	pgFileTreeHeader,
	pgFileTreeIcon,
	pgFileTreeInput,
	pgFileTreeItem,
	pgFileTreeLabel,
	pgFileTreeList,
	pgFileTreeMenu,
	pgFileTreeMenuItem,
	pgFileTreeTwisty,
} from "virtual:styleframe";
import {
	CONFIG_PATH,
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	ENTRY_PATH,
} from "@/state/playground";

const props = defineProps<{
	files: Record<string, string>;
	folders: Array<string>;
	active: string;
	dirty?: Record<string, boolean>;
}>();

const emit = defineEmits<{ select: [path: string] }>();

interface Row {
	kind: "dir" | "file";
	label: string;
	path: string;
	depth: number;
	deletable: boolean;
}

interface TreeNode {
	dirs: Map<string, TreeNode>;
	files: Array<string>;
}

interface MenuItem {
	label: string;
	tone: "default" | "danger";
	run: () => void;
}

function isProtectedFolder(dir: string): boolean {
	const prefix = `${dir}/`;
	return ENTRY_PATH === dir || ENTRY_PATH.startsWith(prefix);
}

// Folders the user has collapsed; their descendants are hidden from the tree.
const collapsed = ref<Set<string>>(new Set());

function isCollapsed(path: string): boolean {
	return collapsed.value.has(path);
}

function toggleFolder(path: string): void {
	const next = new Set(collapsed.value);
	if (next.has(path)) {next.delete(path);}
	else {next.add(path);}
	collapsed.value = next;
}

/** Pick a file-type icon, IDE-style. */
function rowIcon(row: Row): Component {
	if (row.kind === "dir") {return isCollapsed(row.path) ? Folder : FolderOpen;}
	if (row.path === CONFIG_PATH) {return FileCog;}
	if (row.path.endsWith(".styleframe.ts")) {return Palette;}
	if (/\.(tsx|jsx|ts|js|css)$/.test(row.path)) {return FileCode;}
	return File;
}

const rows = computed<Array<Row>>(() => {
	const root: TreeNode = { dirs: new Map(), files: [] };
	const ensureDir = (parts: Array<string>): TreeNode => {
		let node = root;
		for (const part of parts) {
			let child = node.dirs.get(part);
			if (!child) {
				child = { dirs: new Map(), files: [] };
				node.dirs.set(part, child);
			}
			node = child;
		}
		return node;
	};

	for (const path of Object.keys(props.files)) {
		ensureDir(path.split("/").slice(0, -1)).files.push(path);
	}
	for (const folder of props.folders) {
		ensureDir(folder.split("/"));
	}

	const out: Array<Row> = [];
	const walk = (node: TreeNode, depth: number, prefix: string) => {
		for (const dir of [...node.dirs.keys()].sort((a, b) =>
			a.localeCompare(b),
		)) {
			const dirPath = prefix ? `${prefix}/${dir}` : dir;
			out.push({
				kind: "dir",
				label: dir,
				path: dirPath,
				depth,
				deletable: !isProtectedFolder(dirPath),
			});
			if (!collapsed.value.has(dirPath)) {
				walk(node.dirs.get(dir)!, depth + 1, dirPath);
			}
		}
		for (const file of [...node.files].sort((a, b) => a.localeCompare(b))) {
			out.push({
				kind: "file",
				label: file.split("/").pop() ?? file,
				path: file,
				depth,
				deletable: file !== CONFIG_PATH && file !== ENTRY_PATH,
			});
		}
	};
	walk(root, 0, "");
	return out;
});

const hovered = ref<string | null>(null);

// Files only get a menu (Delete) when deletable; folders always do (create).
function hasMenu(row: Row): boolean {
	return row.kind === "dir" || row.deletable;
}

function menuItems(row: Row): Array<MenuItem> {
	if (row.kind === "file") {
		return [
			{ label: "Delete", tone: "danger", run: () => deleteFile(row.path) },
		];
	}
	const items: Array<MenuItem> = [];
	if (row.deletable) {
		items.push({
			label: "Delete",
			tone: "danger",
			run: () => deleteFolder(row.path),
		});
	}
	items.push({
		label: "Create new file",
		tone: "default",
		run: () => startCreate("file", row.path),
	}, {
		label: "Create new folder",
		tone: "default",
		run: () => startCreate("folder", row.path),
	});
	return items;
}

// --- Dropdown menu ---------------------------------------------------------

const MENU_WIDTH = 168;
const menu = ref<{
	path: string;
	items: Array<MenuItem>;
	x: number;
	y: number;
} | null>(null);
const menuEl = ref<HTMLElement | null>(null);

function openMenu(row: Row, event: MouseEvent) {
	event.stopPropagation();
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
	menu.value = {
		path: row.path,
		items: menuItems(row),
		x: Math.max(8, rect.right - MENU_WIDTH),
		y: rect.bottom + 4,
	};
}

function closeMenu() {
	menu.value = null;
}

function runItem(item: MenuItem) {
	closeMenu();
	item.run();
}

function onDocPointerDown(event: MouseEvent) {
	if (menuEl.value && !menuEl.value.contains(event.target as Node)) {closeMenu();}
}

function onDocKeyDown(event: KeyboardEvent) {
	if (event.key === "Escape") {closeMenu();}
}

watch(menu, (value) => {
	if (value) {
		document.addEventListener("pointerdown", onDocPointerDown, true);
		document.addEventListener("keydown", onDocKeyDown);
		window.addEventListener("scroll", closeMenu, true);
		window.addEventListener("resize", closeMenu);
	} else {
		document.removeEventListener("pointerdown", onDocPointerDown, true);
		document.removeEventListener("keydown", onDocKeyDown);
		window.removeEventListener("scroll", closeMenu, true);
		window.removeEventListener("resize", closeMenu);
	}
});

onBeforeUnmount(closeMenu);

// --- Inline create input ---------------------------------------------------

const creating = ref<"file" | "folder" | null>(null);
const draft = ref("");
const inputEl = ref<HTMLInputElement | null>(null);

async function startCreate(kind: "file" | "folder", parent = "") {
	// Expand the target folder so the new entry is visible once created.
	if (parent && collapsed.value.has(parent)) {toggleFolder(parent);}
	creating.value = kind;
	draft.value = parent ? `${parent}/` : "";
	await nextTick();
	const el = inputEl.value;
	if (el) {
		el.focus();
		el.setSelectionRange(draft.value.length, draft.value.length);
	}
}

function commitCreate() {
	if (!creating.value) {return;}
	const kind = creating.value;
	creating.value = null;
	const value = draft.value.trim();
	draft.value = "";
	if (!value) {return;}
	if (kind === "folder") {createFolder(value);}
	else {createFile(value);}
}

function cancelCreate() {
	creating.value = null;
	draft.value = "";
}

function indentStyle(depth: number) {
	return { paddingLeft: `${8 + depth * 12}px` };
}
</script>

<template>
	<aside :class="pgFileTree()">
		<div :class="pgFileTreeHeader()">
			<span>Files</span>
			<span>
				<button
					type="button"
					:class="pgFileTreeAction()"
					aria-label="New folder"
					title="New folder"
					@click="startCreate('folder')"
				>
					<FolderPlus :size="14" />
				</button>
				<button
					type="button"
					:class="pgFileTreeAction()"
					aria-label="New file"
					title="New file"
					@click="startCreate('file')"
				>
					<FilePlus :size="14" />
				</button>
			</span>
		</div>
		<div :class="pgFileTreeList()">
			<input
				v-if="creating"
				ref="inputEl"
				v-model="draft"
				:class="pgFileTreeInput()"
				:placeholder="
					creating === 'folder' ? 'components/Badge' : 'Badge.tsx'
				"
				spellcheck="false"
				@keydown.enter.prevent="commitCreate"
				@keydown.esc.prevent="cancelCreate"
				@blur="commitCreate"
			/>
			<template v-for="row in rows" :key="`${row.kind}:${row.path}`">
				<div
					v-if="row.kind === 'dir'"
					role="button"
					tabindex="0"
					:aria-expanded="!isCollapsed(row.path)"
					:class="pgFileTreeItem()"
					:style="indentStyle(row.depth)"
					:title="row.path"
					@click="toggleFolder(row.path)"
					@keydown.enter.prevent="toggleFolder(row.path)"
					@keydown.space.prevent="toggleFolder(row.path)"
					@mouseenter="hovered = row.path"
					@mouseleave="hovered = null"
				>
					<span :class="pgFileTreeTwisty()">
						<component
							:is="isCollapsed(row.path) ? ChevronRight : ChevronDown"
							:size="14"
						/>
					</span>
					<component :is="rowIcon(row)" :size="15" :class="pgFileTreeIcon()" />
					<span :class="pgFileTreeLabel()">{{ row.label }}</span>
					<button
						v-if="hasMenu(row)"
						type="button"
						:class="pgFileTreeAction()"
						:style="{
							visibility:
								hovered === row.path || menu?.path === row.path
									? 'visible'
									: 'hidden',
						}"
						aria-label="Folder actions"
						:title="`${row.path}/ actions`"
						@click="openMenu(row, $event)"
					>
						<MoreHorizontal :size="14" />
					</button>
				</div>
				<div
					v-else
					role="button"
					tabindex="0"
					:class="
						pgFileTreeItem({
							state: row.path === active ? 'active' : 'inactive',
						})
					"
					:style="indentStyle(row.depth)"
					:title="row.path"
					@click="emit('select', row.path)"
					@keydown.enter="emit('select', row.path)"
					@mouseenter="hovered = row.path"
					@mouseleave="hovered = null"
				>
					<span :class="pgFileTreeTwisty()" aria-hidden="true" />
					<component :is="rowIcon(row)" :size="15" :class="pgFileTreeIcon()" />
					<span
						v-if="dirty?.[row.path]"
						:class="pgFileTabDot()"
						aria-label="Edited"
					/>
					<span :class="pgFileTreeLabel()">{{ row.label }}</span>
					<button
						v-if="hasMenu(row)"
						type="button"
						:class="pgFileTreeAction()"
						:style="{
							visibility:
								hovered === row.path || menu?.path === row.path
									? 'visible'
									: 'hidden',
						}"
						aria-label="File actions"
						:title="`${row.path} actions`"
						@click="openMenu(row, $event)"
					>
						<MoreHorizontal :size="14" />
					</button>
				</div>
			</template>
		</div>
		<Teleport to="body">
			<div
				v-if="menu"
				ref="menuEl"
				:class="pgFileTreeMenu()"
				:style="{ top: `${menu.y}px`, left: `${menu.x}px` }"
				role="menu"
			>
				<button
					v-for="item in menu.items"
					:key="item.label"
					type="button"
					role="menuitem"
					:class="pgFileTreeMenuItem({ tone: item.tone })"
					@click="runItem(item)"
				>
					{{ item.label }}
				</button>
			</div>
		</Teleport>
	</aside>
</template>
