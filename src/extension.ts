import * as vscode from 'vscode';
import { MacroTreeProvider } from './macro_tree_provider';
import { MacroEditor } from './macro_editor';
import { MacroStorage } from './storage/macro_storage';
import { MacroTreeItem } from './macro_tree_item';
import { MacroRunner } from './services/macro_runner';

export function activate(context: vscode.ExtensionContext) {
  const provider = new MacroTreeProvider(context);

  const runner = new MacroRunner();

  vscode.window.registerTreeDataProvider('terminalMacros', provider);

  const disposable = vscode.commands.registerCommand(
    'terminalMacros.createMacro',
    () => {
      MacroEditor.create(context, () => provider.refresh());
    },
  );

  const deleteCommand = vscode.commands.registerCommand(
    'terminalMacros.deleteMacro',
    async (item: MacroTreeItem) => {
      await MacroStorage.remove(context, item.macro.id);

      provider.refresh();
    },
  );

  const editCommand = vscode.commands.registerCommand(
    'terminalMacros.editMacro',
    async (item: MacroTreeItem) => {
      MacroEditor.create(context, () => provider.refresh(), item.macro);
    },
  );

  const runCommand = vscode.commands.registerCommand(
    'terminalMacros.runMacro',
    async (macro) => {
      await runner.run(macro);
    },
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(runCommand);
  context.subscriptions.push(deleteCommand, editCommand);
}

export function deactivate() {}
