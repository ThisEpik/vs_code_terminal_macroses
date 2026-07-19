import * as vscode from 'vscode';
import { spawn } from 'child_process';

export class MacroTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();

  readonly onDidWrite = this.writeEmitter.event;

  private commandQueue: Array<{
    command: string;
    resolve: (success: boolean) => void;
  }> = [];

  private running = false;

  open() {
    this.processQueue();
  }

  close() {}

  async execute(command: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.commandQueue.push({
        command,
        resolve,
      });

      this.processQueue();
    });
  }

  private processQueue() {
    if (this.running) {
      return;
    }

    const item = this.commandQueue.shift();

    if (!item) {
      return;
    }

    this.running = true;

    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

    const args =
      process.platform === 'win32'
        ? ['-NoLogo', '-NoProfile', '-Command', item.command]
        : ['-c', item.command];

    const processInstance = spawn(shell, args, {
      cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
      env: process.env,
    });

    processInstance.stdout.on('data', (data) => {
      this.writeEmitter.fire(data.toString());
    });

    processInstance.stderr.on('data', (data) => {
      this.writeEmitter.fire(data.toString());
    });

    processInstance.on('close', (code) => {
      this.running = false;

      item.resolve(code === 0);

      this.processQueue();
    });
  }
}
