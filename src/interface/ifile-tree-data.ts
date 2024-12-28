import * as vscode from 'vscode';
import IItem from './iitem';

export interface IFileTreeDataItem {
	/**
	 * Get the file name
	 * @returns {string}
	 */
	getFile(): string;

	/**
	 * Get the line number
	 * @returns {number}
	 */
	getLine(): number;

	/**
	 * Get the label
	 * @returns {string}
	 */
	getLabel(): string;

	/**
	 * Get the icon path
	 * @returns {vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined}
	 */
	getIconPath(): vscode.Uri | { light: vscode.Uri, dark: vscode.Uri } | vscode.ThemeIcon | undefined;

	/**
	 * Get a parent
	 * @returns {IFileTreeDataItem | undefined}
	 */
	getParent(): IFileTreeDataItem | undefined;

	/**
	 * Get children
	 * @returns {IFileTreeDataItem[]}
	 */
	getChildren(): IFileTreeDataItem[];

	/**
	 * Push a child
	 * @param {IFileTreeDataItem} child
	 * @returns {void}
	 */
	pushChild(child: IFileTreeDataItem): void;
}

export default interface IFileTreeData extends vscode.TreeDataProvider<IFileTreeDataItem> {
	/**
	 * Reload
	 * @param {IItem[]} items
	 * @param {string} word
	 * @param {string} cwd
	 * @param {string} cmd
	 * @returns {void}
	 */
	reload(items: IItem[], word: string, cwd: string, cmd: string): void;

	/**
	 * Clear results
	 * @returns {void}
	 */
	clear(): void;

	/**
	 * Dispose
	 * @returns {void}
	 */
	dispose(): void;
}
