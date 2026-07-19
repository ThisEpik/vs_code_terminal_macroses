import * as vscode from 'vscode';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Macro } from '../models/macro';

export class MacroRunner {
  private shell?: ChildProcessWithoutNullStreams;

  private output = vscode.window.createOutputChannel('Macro Runner');

  async run(macro: Macro) {
    this.output.show();

    await this.startShell();

    for (const command of macro.commands) {
      const success = await this.execute(command);

      if (!success) {
        this.output.appendLine(`FAILED: ${command}`);

        vscode.window.showErrorMessage(`Command failed: ${command}`);

        this.dispose();

        return;
      }
    }

    this.output.appendLine(`Macro "${macro.name}" finished`);

    vscode.window.showInformationMessage(`Macro "${macro.name}" finished`);

    this.dispose();
  }

  private startShell(): Promise<void> {
    return new Promise((resolve) => {
      const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

      const args =
        process.platform === 'win32' ? ['-NoLogo', '-NoProfile'] : [];

      this.shell = spawn(shell, args, {
        cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,

        env: process.env,
      });

      this.shell.stdout.on('data', (data) => {
        this.output.append(data.toString());
      });

      this.shell.stderr.on('data', (data) => {
        this.output.append(data.toString());
      });

      resolve();
    });
  }

  private execute(command: string): Promise<boolean> {
    return new Promise((resolve) => {
      const marker = `__MACRO_EXIT_${Date.now()}__`;

      const script = `
${command}
$code = $LASTEXITCODE
Write-Output "${marker}$code"
`;

      let buffer = '';

      const listener = (data: Buffer) => {
        const text = data.toString();

        buffer += text;

        this.output.append(text);

        const index = buffer.indexOf(marker);

        if (index !== -1) {
          const result = buffer.substring(index + marker.length).trim();

          this.shell!.stdout.removeListener('data', listener);

          resolve(result.startsWith('0'));
        }
      };

      this.shell!.stdout.on('data', listener);

      const encoded = Buffer.from(script, 'utf16le').toString('base64');

      this.shell!.stdin.write(`powershell -EncodedCommand ${encoded}\n`);
    });
  }

  private dispose() {
    this.shell?.kill();

    this.shell = undefined;
  }
}
