import * as vscode from 'vscode';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

export class MacroTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();

  readonly onDidWrite = this.writeEmitter.event;

  private shell?: ChildProcessWithoutNullStreams;

  open() {
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

    this.shell = spawn(shell, [], {
      cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
    });

    this.shell.stdout.on('data', (data) => {
      this.writeEmitter.fire(data.toString());
    });

    this.shell.stderr.on('data', (data) => {
      this.writeEmitter.fire(data.toString());
    });
  }

  close() {
    this.shell?.kill();
  }

  send(command: string) {
    this.shell?.stdin.write(command + '\n');
  }
}
