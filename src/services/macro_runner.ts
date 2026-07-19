import * as vscode from 'vscode';
import { Macro } from '../models/macro';
import { MacroTerminal } from './macro_terminal';

export class MacroRunner {
  private terminal?: vscode.Terminal;

  private macroTerminal?: MacroTerminal;

  async run(macro: Macro) {
    this.macroTerminal = new MacroTerminal();

    this.terminal = vscode.window.createTerminal({
      name: 'Macro Runner',
      pty: this.macroTerminal,
    });

    this.terminal.show();

    for (const command of macro.commands) {
      const success = await this.macroTerminal.execute(command);

      if (!success) {
        vscode.window.showErrorMessage(`Failed: ${command}`);

        return;
      }
    }

    vscode.window.showInformationMessage(`Macro "${macro.name}" finished`);
  }
}
