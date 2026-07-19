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

  static async update(context: vscode.ExtensionContext, updatedMacro: Macro) {
    const macros = this.getAll(context);

    const index = macros.findIndex((x) => x.id === updatedMacro.id);

    if (index === -1) return;

    macros[index] = updatedMacro;

    await this.save(context, macros);
  }

  static async remove(context: vscode.ExtensionContext, id: string) {
    const macros = this.getAll(context);

    const filtered = macros.filter((x) => x.id !== id);

    await this.save(context, filtered);
  }
}
