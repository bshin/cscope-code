import * as vscode from 'vscode';
import * as path from 'path';
import IConfig from '../interface/iconfig';
import IEnv from '../interface/ienv';
import IResource from '../interface/iresource';
import { FilePosition } from '../interface/position';
import IItem from '../interface/iitem';
import IFileTreeData, { IFileTreeDataItem } from '../interface/ifile-tree-data';

const IconMap: { [key: string]: string } = Object.freeze({
	'.c': 'file_type_c',
	'.cc': 'file_type_cpp',
	'.cpp': 'file_type_cpp',
	'.h': 'file_type_cheader',
	'.hh': 'file_type_cppheader',
	'.hpp': 'file_type_cppheader'
});

class FileTreeDataItem implements IFileTreeDataItem {
	/**
	 * @property {string} file
	 * @property {number} line
	 * @property {string} label
	 * @property {vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined} iconPath
	 * @property {IFileTreeDataItem} parent
	 * @property {IFileTreeDataItem[]} children
	 */
	private file: string;
	private line: number;
	private label: string;
	private iconPath: vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined;
	private parent: IFileTreeDataItem | undefined;
	private children: IFileTreeDataItem[]

	/**
	 * @constructor
	 * @param {IResource} res
	 * @param {string} label
	 * @param {string} file
	 * @param {number} line
	 * @param {IFileTreeDataItem | undefined} parent
	 */
	constructor(res: IResource, label: string, file: string = '', line: number = 0, parent: IFileTreeDataItem | undefined = undefined) {
		this.file = file;
		this.line = line;
		this.label = label;
		this.parent = parent;
		this.children = [];
		const ext = path.extname(file).toLowerCase();
		this.iconPath = res.get(IconMap[ext]);
		if (!this.iconPath) {
			this.iconPath = vscode.ThemeIcon.File;
		}
	}

	/**
	 * Get the file name
	 * @returns {string}
	 */
	getFile(): string {
		return this.file;
	}

	/**
	 * Get the line number
	 * @returns {number}
	 */
	getLine(): number {
		return this.line;
	}

	/**
	 * Get the label
	 * @returns {string}
	 */
	getLabel(): string {
		return this.label;
	}

	/**
	 * Get the icon path
	 * @returns {vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined}
	 */
	getIconPath(): vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined {
		return this.iconPath;
	}

	/**
	 * Get a parent
	 * @returns {IFileTreeDataItem | undefined}
	 */
	getParent(): IFileTreeDataItem | undefined {
		return this.parent;
	}

	/**
	 * Get children
	 * @returns {IFileTreeDataItem[]}
	 */
	getChildren(): IFileTreeDataItem[] {
		return this.children;
	}

	/**
	 * Push a child
	 * @param {IFileTreeDataItem} child
	 * @returns {void}
	 */
	pushChild(child: IFileTreeDataItem): void {
		this.children.push(child);
	}
}

export default class FileTreeData implements IFileTreeData {
	/**
	 * @property {IConfig} config
	 * @property {IEnv} env
	 * @property {IResource} res
	 * @property {string} word
	 * @property {string} cwd
	 * @property {vscode.TreeView<IFileTreeDataItem>} treeView
	 * @property {Map<string, IFileTreeDataItem>} items
	 */
	private config: IConfig;
	private env: IEnv;
	private res: IResource;
	private word: string;
	private cwd: string;
	private treeView: vscode.TreeView<IFileTreeDataItem>;
	private items: Map<string, IFileTreeDataItem>;
	private _onDidChangeTreeData = new vscode.EventEmitter<IFileTreeDataItem | undefined | null>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(config: IConfig, env: IEnv, res: IResource) {
		this.config = config;
		this.env = env;
		this.res = res;
		this.word = '';
		this.cwd = '';
		this.treeView = vscode.window.createTreeView('cscopeTreeView', {showCollapseAll: true, treeDataProvider: this});
		this.items = new Map<string, IFileTreeDataItem>();
	}

	private async setItems(items: IItem[], word: string, cwd: string, cmd: string): Promise<void> {
		this.word = word;
		this.cwd = cwd;
		const root = new FileTreeDataItem(this.res, cmd);
		const curMap = new Map<string, FileTreeDataItem>();
		if (this.config.get('clearTreeView')) {
			this.items.clear();
		}
		for (let item of items) {
			const file = item.getFile();
			const line = item.getLine()
			const label = item.getFunction() + '[' + line + '] ' + item.getText();
			let parent = curMap.get(file);
			if (parent == undefined) {
				parent = new FileTreeDataItem(this.res, file, file, 0, root);
				curMap.set(file, parent);
				root.pushChild(parent);
			}
			const treeItem = new FileTreeDataItem(this.res, label, file, line, parent);
			parent.pushChild(treeItem);
		}
		this.items.set(cmd, root);
	}

	getChildren(element?: IFileTreeDataItem): IFileTreeDataItem[] {
		if (element == undefined) {
			return Array.from(this.items.values());
		}
		return element.getChildren();
	}

	getParent(element: IFileTreeDataItem): IFileTreeDataItem | undefined {
		return element.getParent();
	}

	getTreeItem(element: IFileTreeDataItem): vscode.TreeItem {
		const collapsibleState = element.getChildren().length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
		const treeItem = new vscode.TreeItem(element.getLabel(), collapsibleState);
		treeItem.iconPath = element.getIconPath();
		const file = element.getFile();
		const uri = path.isAbsolute(file) ? file : path.join(this.cwd, file);
		const position = new FilePosition(uri, element.getLine(), 0);
		if (element.getChildren().length == 0) {
			treeItem.command = { title: 'go', command: 'cscope-code:go', arguments: [position, this.word] };
		}
		return treeItem;
	}

	async reload(items: IItem[], word: string, cwd: string, cmd: string): Promise<void> {
		await this.setItems(items, word, cwd, cmd);
		this._onDidChangeTreeData.fire(undefined);
		const root = this.items.get(cmd);
		const parents = root?.getChildren();
		if (!parents) {
			return;
		}
		const firstItems = parents[0].getChildren();
		if (!firstItems) {
			return;
		}
		vscode.commands.executeCommand('workbench.actions.treeView.cscopeTreeView.collapseAll');
		this.treeView.reveal(firstItems[0]);
	}

	clear(): void {
		this.items.clear();
		this._onDidChangeTreeData.fire(undefined);
	}

	dispose(): void {
		this.treeView.dispose();
	}
}
