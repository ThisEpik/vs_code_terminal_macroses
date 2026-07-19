import * as vscode from 'vscode';
import { Macro } from '../models/macro';

export class MacroStorage {
  private static key = 'terminalMacros';

  static getAll(context: vscode.ExtensionContext): Macro[] {
    return context.globalState.get<Macro[]>(this.key, []);
  }

  static async save(context: vscode.ExtensionContext, macros: Macro[]) {
    await context.globalState.update(this.key, macros);
  }

  static async add(context: vscode.ExtensionContext, macro: Macro) {
    const macros = this.getAll(context);

    macros.push(macro);

    await this.save(context, macros);
  }
}
