import * as vscode from 'vscode';
import { Macro } from '../models/macro';

export class MacroRunner {
  private terminal?: vscode.Terminal;

  async run(macro: Macro) {
    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal('Macro Runner');
    }

    this.terminal.show();

    for (const command of macro.commands) {
      await this.execute(command);
    }

    vscode.window.showInformationMessage(`Macro "${macro.name}" executed`);
  }

  private execute(command: string): Promise<void> {
    return new Promise((resolve) => {
      this.terminal!.sendText(command);

      resolve();
    });
  }
}
