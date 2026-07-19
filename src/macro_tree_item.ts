import * as vscode from 'vscode';
import { Macro } from './models/macro';

export class MacroTreeItem extends vscode.TreeItem {
  constructor(public readonly macro: Macro) {
    super(macro.name, vscode.TreeItemCollapsibleState.None);

    this.description = `${macro.commands.length} commands`;

    this.contextValue = 'macro';
  }
}
