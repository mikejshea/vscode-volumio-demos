import { Console } from 'console';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "release-radar-command" is now active!');

	let disposable = vscode.commands.registerCommand('release-radar-command.getplaylist', () => {
		const wsedit = new vscode.WorkspaceEdit();
		const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
		const filePath = vscode.Uri.file(wsPath + '/releaseRadar.json');
		wsedit.createFile(filePath, { ignoreIfExists: true });
		  vscode.workspace.applyEdit(wsedit).then(result => {
			if (result) {
					vscode.workspace.openTextDocument(filePath).then(doc => {
					vscode.window.showTextDocument(doc, 1, false).then(e => {
						e.edit(edit => {
							edit.delete(new vscode.Range(
								doc.positionAt(0),
								doc.positionAt(doc.getText().length)));
								getPlaylist(e);
							});
						});
					});
				};
			});
		});
	context.subscriptions.push(disposable);
}

function getPlaylist(editor: any) {
	getReleaseRadar().then((res: any) => {
		editor.edit((edit: { insert: (arg0: vscode.Position, arg1: any) => void; }) => {
			edit.insert(new vscode.Position(0,0), JSON.stringify(res, null, 2));
		});
		vscode.window.showInformationMessage(`Updated File`);
	}).catch((err: any) =>
		vscode.window.showInformationMessage(`Error: ${err}`)
	);
}

async function getReleaseRadar() {
	var axios = require('axios');
	var config = {
		'method': 'GET',
		'url': `http://volumio.local/api/v1/browse?uri=spotify:user:spotify:playlist:37i9dQZEVXbwRkyuDj1f9w`,
		'headers': { }
	};
	return await axios(config)
		.then((res: { data: any; }) => res.data.navigation.lists[0].items)
		.catch((err: any) => console.error(err));
} 

// this method is called when your extension is deactivated
export function deactivate() {}
