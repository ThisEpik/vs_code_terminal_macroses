import * as vscode from "vscode";

export class MacroTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {

        return [
            new vscode.TreeItem(
                "Create New Macro",
                vscode.TreeItemCollapsibleState.None
            )
        ];
    }
}