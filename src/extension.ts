import * as vscode from 'vscode';
import { MacroTreeProvider } from './macro_tree_provider';
import { MacroEditor } from './macro_editor';

export function activate(context: vscode.ExtensionContext) {
  const provider = new MacroTreeProvider(context);

  vscode.window.registerTreeDataProvider('terminalMacros', provider);

  const disposable = vscode.commands.registerCommand(
    'terminalMacros.createMacro',
    () => {
      MacroEditor.create(context, () => provider.refresh());
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
