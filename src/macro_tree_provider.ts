import * as vscode from "vscode";
import { MacroStorage } from "./storage/macro_storage";
import { Macro } from "./models/macro";


export class MacroTreeProvider 
implements vscode.TreeDataProvider<vscode.TreeItem> {


    private context: vscode.ExtensionContext;

    private _onDidChangeTreeData =
    new vscode.EventEmitter<void>();


readonly onDidChangeTreeData =
    this._onDidChangeTreeData.event;


    constructor(
        context: vscode.ExtensionContext
    ) {

        this.context = context;

    }


    getTreeItem(
        element: vscode.TreeItem
    ): vscode.TreeItem {

        return element;

    }

    refresh(){

    this._onDidChangeTreeData.fire();

}


    async getChildren()
    : Promise<vscode.TreeItem[]> {


        const items: vscode.TreeItem[] = [];


        const create =
            new vscode.TreeItem(
                "Create New Macro"
            );


        create.command = {

            command:
            "terminalMacros.createMacro",

            title:
            "Create New Macro"

        };


        items.push(create);



        const macros =
            MacroStorage.getAll(
                this.context
            );


        for(const macro of macros){


            const item =
                new vscode.TreeItem(
                    macro.name
                );


            item.description =
                `${macro.commands.length} commands`;


            items.push(item);

        }


        return items;

    }

}