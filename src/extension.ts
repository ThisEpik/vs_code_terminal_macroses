import * as vscode from "vscode";
import { MacroTreeProvider } from "./macro_tree_provider";

export function activate(context: vscode.ExtensionContext) {

    const provider = new MacroTreeProvider();

    vscode.window.registerTreeDataProvider(
        "terminalMacros",
        provider
    );

    const disposable = vscode.commands.registerCommand(
        "terminalMacros.createMacro",
        () => {
            vscode.window.showInformationMessage("Create macro");
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}