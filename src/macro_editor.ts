import * as vscode from "vscode";
import { MacroStorage } from "./storage/macro_storage";
import { Macro } from "./models/macro";

export class MacroEditor {

    public static create(context: vscode.ExtensionContext,
    refresh: ()=>void
) {
    

        const panel = vscode.window.createWebviewPanel(
            "macroEditor",
            "Create Macro",
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.getHtml();

        panel.webview.onDidReceiveMessage(
            async message => {

                switch (message.command) {

                    case "save":

    const macro: Macro = {

        id: Date.now().toString(),

        name: message.name,

        commands:
            message.commands
            .split("\n")
            .map((x: string)=>x.trim())
            .filter((x: string)=>x.length > 0)

    };


    await MacroStorage.add(
        context,
        macro
    );

    refresh();


    vscode.window.showInformationMessage(
        `Macro "${macro.name}" created`
    );


    panel.dispose();

    break;
                }

            },
            undefined,
            context.subscriptions
        );
    }


    private static getHtml(): string {

        return `
        <!DOCTYPE html>
        <html>
        <head>
        <style>

            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
            }

            input, textarea {
                width: 100%;
                margin-top: 10px;
                margin-bottom: 20px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                padding: 8px;
            }

            textarea {
                height: 200px;
                resize: vertical;
            }

            button {
                padding: 8px 20px;
                cursor: pointer;
            }

        </style>
        </head>

        <body>

        <h2>Create Macro</h2>


        <label>
            Macro name
        </label>

        <input id="name" placeholder="Build">


        <label>
            Commands
        </label>

        <textarea id="commands"
        placeholder="npm install
npm run build
npm test"></textarea>


        <button onclick="save()">
            Save
        </button>


        <script>

            const vscode = acquireVsCodeApi();


            function save(){

                vscode.postMessage({

                    command: "save",
                    name: document.getElementById("name").value,
                    commands:
                    document.getElementById("commands").value

                });

            }

        </script>

        </body>
        </html>
        `;
    }
}