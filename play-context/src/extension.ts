import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "play-context" is now active!');

	let playSongDisposable = vscode.commands.registerCommand('play-context.playSong', async function (uri) {
		vscode.workspace.openTextDocument(uri).then(doc => {
			const playlist = JSON.parse(doc.getText());
			const songs = playlist.list.map((a: { name: string; }) => ({label: a.name, song: a}));
			vscode.window.showQuickPick(songs, {
				placeHolder: 'Select a song to play'
			}).then( selection => {
				if (!selection) {
					vscode.window.showInformationMessage('No song to play, canceling');
					return;
				}
				replaceAndPlay({"index": 0, item: selection.song})
				.then( x => console.log(vscode.window.showInformationMessage('Playing Song: ' + selection.label)))
				.catch( err => console.log("Error:" + err));
			});
		});
	});

	context.subscriptions.push(playSongDisposable);

	let queuePlayListDisposable = vscode.commands.registerCommand('play-context.replaceAndPlay', async function (uri) {
		vscode.workspace.openTextDocument(uri).then(doc => {
			const playlist = JSON.parse(doc.getText());
			const songs = playlist.list.map((a: { name: string; }) => ({label: a.name, song: a}));
			replaceAndPlay(playlist)
				.then( x => console.log(vscode.window.showInformationMessage('Playing ReleaseRadar')))
				.catch( err => console.log("Error:" + err));
			});
	});

	context.subscriptions.push(queuePlayListDisposable);
}

async function replaceAndPlay(body: any) {
	var axios = require('axios');
	var config = {
		'method': 'POST',
		'url': `http://volumio.local/api/v1/replaceAndPlay`,
		'headers': { 'Content-Type': 'application/json' },
		'data': JSON.stringify(body, null, 2)
	};
	console.log(JSON.stringify(body, null, 2));
	return await axios(config)
		.then((res: { data: any; }) => res.data)
		.catch((err: any) => console.error(err));
}  
export function deactivate() {}
