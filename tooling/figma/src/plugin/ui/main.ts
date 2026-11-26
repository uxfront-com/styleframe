import type { DTCGResolverDocument } from "@styleframe/dtcg";
import type { FigmaExportFormat } from "../../types";
import { extractDTCGVariables, isDTCGFormat, isDTCGResolver } from "../shared";
import type { PreviewVariable } from "../shared";

interface Collection {
	id: string;
	name: string;
	modes: Array<{ id: string; name: string }>;
	variableCount: number;
}

// DOM Elements
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// Import elements
const fileDropZone = document.getElementById("file-drop-zone")!;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const fileSelected = document.getElementById("file-selected")!;
const fileName = document.getElementById("file-name")!;
const fileClearBtn = document.getElementById("file-clear-btn")!;
const importBtn = document.getElementById("import-btn") as HTMLButtonElement;
const importPreview = document.getElementById("import-preview")!;
const importStatus = document.getElementById("import-status")!;

// Store loaded files — auto-classified into tokens and resolver
let loadedTokenFiles: Array<{ name: string; data: unknown }> = [];
let loadedResolverData: DTCGResolverDocument | null = null;

// Export elements
const collectionSelect = document.getElementById(
	"collection-select",
) as HTMLSelectElement;
const modeSelect = document.getElementById("mode-select") as HTMLSelectElement;
const refreshBtn = document.getElementById("refresh-btn")!;
const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;
const exportOutput = document.getElementById(
	"export-output",
) as HTMLTextAreaElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const downloadBtn = document.getElementById(
	"download-btn",
) as HTMLButtonElement;
const exportStatus = document.getElementById("export-status")!;

let currentMode: "import" | "export" = "import";
let collections: Array<Collection> = [];

/**
 * Initialize the UI
 */
function init(): void {
	// Tab switching
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const mode = tab.getAttribute("data-tab") as "import" | "export";
			switchTab(mode);
		});
	});

	// Import handlers
	fileDropZone.addEventListener("click", () => fileInput.click());
	fileInput.addEventListener("change", handleFileSelect);
	fileClearBtn.addEventListener("click", handleFileClear);
	importBtn.addEventListener("click", handleImport);
	fileDropZone.addEventListener("dragover", handleDragOver);
	fileDropZone.addEventListener("dragleave", handleDragLeave);
	fileDropZone.addEventListener("drop", handleDrop);

	// Export handlers
	collectionSelect.addEventListener("change", updateModeSelect);
	refreshBtn.addEventListener("click", requestCollections);
	exportBtn.addEventListener("click", handleExport);
	copyBtn.addEventListener("click", handleCopy);
	downloadBtn.addEventListener("click", handleDownload);

	// Request initial collections
	requestCollections();
}

/**
 * Switch between import and export tabs
 */
function switchTab(mode: "import" | "export"): void {
	currentMode = mode;

	tabs.forEach((tab) => {
		tab.classList.toggle("active", tab.getAttribute("data-tab") === mode);
	});

	panels.forEach((panel) => {
		panel.classList.toggle("active", panel.id === `${mode}-panel`);
	});
}

/**
 * Handle drag over event
 */
function handleDragOver(e: DragEvent): void {
	e.preventDefault();
	e.stopPropagation();
	fileDropZone.classList.add("drag-over");
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e: DragEvent): void {
	e.preventDefault();
	e.stopPropagation();
	fileDropZone.classList.remove("drag-over");
}

/**
 * Handle drop event
 */
function handleDrop(e: DragEvent): void {
	e.preventDefault();
	e.stopPropagation();
	fileDropZone.classList.remove("drag-over");

	const fileList = e.dataTransfer?.files;
	if (!fileList || fileList.length === 0) {
		return;
	}

	const jsonFiles: Array<File> = [];
	for (let i = 0; i < fileList.length; i++) {
		const file = fileList[i]!;
		if (file.type === "application/json" || file.name.endsWith(".json")) {
			jsonFiles.push(file);
		}
	}

	if (jsonFiles.length === 0) {
		showStatus(importStatus, "error", "Please select JSON file(s)");
		return;
	}

	processFiles(jsonFiles);
}

/**
 * Handle file input change
 */
function handleFileSelect(): void {
	const fileList = fileInput.files;
	if (!fileList || fileList.length === 0) {
		return;
	}
	const files: Array<File> = [];
	for (let i = 0; i < fileList.length; i++) {
		files.push(fileList[i]!);
	}
	processFiles(files);
}

/**
 * Read a File as text using FileReader (promisified).
 */
function readFileAsText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
		reader.readAsText(file);
	});
}

/**
 * Process one or more dropped/selected files. Auto-classifies each as
 * a resolver or a token document, accumulating into the shared state.
 */
async function processFiles(files: Array<File>): Promise<void> {
	hideStatus(importStatus);

	try {
		const results = await Promise.all(
			files.map(async (file) => {
				const content = await readFileAsText(file);
				return { name: file.name, data: JSON.parse(content) };
			}),
		);

		for (const { name, data } of results) {
			if (isDTCGResolver(data)) {
				loadedResolverData = data;
			} else {
				loadedTokenFiles.push({ name, data });
			}
		}

		if (loadedTokenFiles.length === 0) {
			throw new Error("No token files found — only resolver(s) detected");
		}

		const allNames = loadedTokenFiles.map((f) => f.name);
		if (loadedResolverData) {
			allNames.push("(resolver)");
		}

		fileDropZone
			.querySelector(".file-drop-content")
			?.setAttribute("hidden", "");
		fileSelected.removeAttribute("hidden");
		fileName.textContent = allNames.join(", ");

		const variables = getMergedPreviewVariables();
		renderPreview(variables);
		importBtn.disabled = false;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Invalid JSON";
		importPreview.innerHTML = `<div class="preview-empty" style="color: var(--color-error)">${message}</div>`;
		importBtn.disabled = true;
		loadedTokenFiles = [];
		loadedResolverData = null;
	}
}

/**
 * Merge preview variables from all loaded token files (de-duplicated).
 */
function getMergedPreviewVariables(): Array<PreviewVariable> {
	const seen = new Map<string, PreviewVariable>();
	for (const { data } of loadedTokenFiles) {
		const vars = getPreviewVariables(data);
		for (const v of vars) {
			if (!seen.has(v.name)) {
				seen.set(v.name, v);
			}
		}
	}
	if (seen.size === 0) {
		throw new Error("No variables found in files");
	}
	return [...seen.values()];
}

/**
 * Handle clear file button
 */
function handleFileClear(e: Event): void {
	e.stopPropagation();
	fileInput.value = "";
	loadedTokenFiles = [];
	loadedResolverData = null;

	fileDropZone.querySelector(".file-drop-content")?.removeAttribute("hidden");
	fileSelected.setAttribute("hidden", "");
	fileName.textContent = "";

	importPreview.innerHTML =
		'<div class="preview-empty">Select JSON file(s) to preview variables</div>';
	importBtn.disabled = true;
	hideStatus(importStatus);
}

/**
 * Get preview variables from either DTCG or legacy format
 */
function getPreviewVariables(data: unknown): Array<PreviewVariable> {
	if (typeof data !== "object" || data === null) {
		throw new Error("Invalid format: expected an object");
	}

	if (isDTCGFormat(data)) {
		const variables = extractDTCGVariables(data);
		if (variables.length === 0) {
			throw new Error("No variables found in DTCG format");
		}
		return variables;
	}

	// Legacy format
	const obj = data as FigmaExportFormat;
	if (!Array.isArray(obj.variables)) {
		throw new Error("Invalid format: not a valid DTCG or legacy format");
	}

	return obj.variables.map((v) => ({
		name: v.name,
		type: v.type,
	}));
}

/**
 * Render the variable preview
 */
function renderPreview(variables: Array<PreviewVariable>): void {
	if (variables.length === 0) {
		importPreview.innerHTML =
			'<div class="preview-empty">No variables found in file</div>';
		return;
	}

	const html = `
		<div class="variable-list">
			${variables
				.map(
					(v) => `
				<div class="variable-item">
					<span class="variable-name">${v.name}</span>
					<span class="variable-type ${v.type.toLowerCase()}">${v.type}</span>
				</div>
			`,
				)
				.join("")}
		</div>
	`;

	importPreview.innerHTML = html;
}

/**
 * Handle import button click
 */
function handleImport(): void {
	if (loadedTokenFiles.length === 0) {
		showStatus(importStatus, "error", "No file loaded");
		return;
	}

	if (loadedTokenFiles.length > 1) {
		const modes: Record<string, unknown> = {};
		for (const { name, data } of loadedTokenFiles) {
			const modeName = extractModeName(data, name);
			modes[modeName] = data;
		}
		parent.postMessage({ pluginMessage: { type: "import", modes } }, "*");
	} else {
		const { name, data } = loadedTokenFiles[0]!;
		parent.postMessage(
			{
				pluginMessage: {
					type: "import",
					data,
					resolver: loadedResolverData ?? undefined,
					tokensRef: name,
				},
			},
			"*",
		);
	}

	importBtn.disabled = true;
}

function extractModeName(data: unknown, filename: string): string {
	if (typeof data === "object" && data !== null) {
		const ext = (data as Record<string, unknown>).$extensions;
		if (typeof ext === "object" && ext !== null) {
			const figmaMode = (ext as Record<string, unknown>)["com.figma.modeName"];
			if (typeof figmaMode === "string") {
				return figmaMode;
			}
			const sfExt = (ext as Record<string, unknown>)["dev.styleframe"];
			if (typeof sfExt === "object" && sfExt !== null) {
				const modeName = (sfExt as Record<string, unknown>).modeName;
				if (typeof modeName === "string") {
					return modeName;
				}
			}
		}
	}
	return filename.replace(/\.tokens\.json$/, "").replace(/\.json$/, "");
}

/**
 * Request collections from the plugin
 */
function requestCollections(): void {
	parent.postMessage({ pluginMessage: { type: "get-collections" } }, "*");
}

/**
 * Update the mode dropdown based on the currently selected collection.
 */
function updateModeSelect(): void {
	const selectedId = collectionSelect.value;
	const collection = collections.find((c) => c.id === selectedId);

	modeSelect.innerHTML = '<option value="">All modes</option>';

	if (collection && collection.modes.length > 1) {
		modeSelect.innerHTML += collection.modes
			.map((m) => `<option value="${m.id}">${m.name}</option>`)
			.join("");
	}
}

/**
 * Handle export button click
 */
function handleExport(): void {
	const collectionId = collectionSelect.value || undefined;
	const modeId = modeSelect.value || undefined;
	parent.postMessage(
		{ pluginMessage: { type: "export", collectionId, modeId } },
		"*",
	);
	exportBtn.disabled = true;
}

/**
 * Handle copy button click
 */
function handleCopy(): void {
	const text = exportOutput.value;
	if (!text) {
		return;
	}

	const originalHTML = copyBtn.innerHTML;
	const checkmarkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
		<path d="M20 6L9 17l-5-5" stroke="#14ae5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`;

	// Try modern clipboard API first, fallback to execCommand
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fallback for Figma plugin sandbox
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.append(textarea);
			textarea.select();
			const success = document.execCommand("copy");
			document.body.removeChild(textarea);
			return success;
		}
	};

	copyToClipboard().then((success) => {
		if (success) {
			copyBtn.innerHTML = checkmarkIcon;
			copyBtn.title = "Copied to clipboard";
			copyBtn.classList.add("copied");
			setTimeout(() => {
				copyBtn.innerHTML = originalHTML;
				copyBtn.title = "Copy";
				copyBtn.classList.remove("copied");
			}, 2000);
		}
	});
}

/**
 * Handle download button click
 */
function handleDownload(): void {
	const text = exportOutput.value;
	if (!text) {
		return;
	}

	const blob = new Blob([text], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "tokens.json";
	document.body.append(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Update collections dropdown
 */
function updateCollections(newCollections: Array<Collection>): void {
	collections = newCollections;

	if (collections.length === 0) {
		collectionSelect.innerHTML =
			'<option value="">No collections found</option>';
		exportBtn.disabled = true;
		return;
	}

	collectionSelect.innerHTML = collections
		.map(
			(c) =>
				`<option value="${c.id}">${c.name} (${c.variableCount} variables)</option>`,
		)
		.join("");

	updateModeSelect();
	exportBtn.disabled = false;
}

/**
 * Show a status message
 */
function showStatus(
	element: HTMLElement,
	type: "success" | "error",
	message: string,
): void {
	element.textContent = message;
	element.className = `status visible ${type}`;
}

/**
 * Hide a status message
 */
function hideStatus(element: HTMLElement): void {
	element.className = "status";
}

/**
 * Handle messages from the plugin
 */
window.onmessage = (event: MessageEvent) => {
	const msg = event.data.pluginMessage;
	if (!msg) {
		return;
	}

	switch (msg.type) {
		case "set-mode":
			switchTab(msg.mode);
			break;

		case "collections":
			updateCollections(msg.collections);
			break;

		case "import-complete":
			showStatus(
				importStatus,
				"success",
				`Successfully imported ${msg.result.variablesCreated} variables to "${msg.result.collection}"`,
			);
			importBtn.disabled = false;
			break;

		case "export-complete": {
			exportOutput.value = JSON.stringify(msg.result, null, 2);
			const tokensDoc = msg.result.tokens ?? msg.result;
			const exportedVars = extractDTCGVariables(tokensDoc);
			const collectionName =
				tokensDoc.$extensions?.["dev.styleframe"]?.collection || "Collection";
			showStatus(
				exportStatus,
				"success",
				`Exported ${exportedVars.length} variables from "${collectionName}"`,
			);
			exportBtn.disabled = false;
			copyBtn.disabled = false;
			downloadBtn.disabled = false;
			break;
		}

		case "error":
			if (currentMode === "import") {
				showStatus(importStatus, "error", msg.message);
				importBtn.disabled = false;
			} else {
				showStatus(exportStatus, "error", msg.message);
				exportBtn.disabled = false;
			}
			break;
	}
};

// Initialize when DOM is ready
init();
