import * as vscode from 'vscode';
let volumioSBPlayItem: vscode.StatusBarItem;
let volumioSBNextItem: vscode.StatusBarItem;
let volumioSBPrevItem: vscode.StatusBarItem;
let volumioSBInfoItem: vscode.StatusBarItem;
let volumioServer: string;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	const volumioPlayCmdId = 'Volumio.Play';
	const volumioNextCmdId = 'Volumio.Next';
	const volumioPrevCmdId = 'Volumio.Prev';
	const volumioInfoCmdId = 'Volumio.Info';

	const settings = vscode.workspace.getConfiguration('volumioext');
	volumioServer = settings.server;
	
	subscriptions.push(vscode.commands.registerCommand(volumioPlayCmdId, () => {
		const n = togglePlayBack();
		//vscode.window.showInformationMessage(`Volumio: Playing Song!`);
	}));
	subscriptions.push(vscode.commands.registerCommand(volumioPrevCmdId, () => {
		const n = playPreviousSong();
		// vscode.window.showInformationMessage(`Volumio: Previous Song!`);
	}));
	subscriptions.push(vscode.commands.registerCommand(volumioNextCmdId, () => {
		const n = playNextSong();
		// vscode.window.showInformationMessage(`Volumio: Next Song!`);
	}));
	subscriptions.push(vscode.commands.registerCommand(volumioInfoCmdId, () => {
		getVolumioState().then(res => 
			vscode.window.showInformationMessage(`${res}`)
		);
	}));

	
	volumioSBPrevItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 4);
	volumioSBPrevItem.command = volumioPrevCmdId;
	subscriptions.push(volumioSBPrevItem);

	volumioSBPlayItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 3);
	volumioSBPlayItem.command = volumioPlayCmdId;
	subscriptions.push(volumioSBPlayItem);

	volumioSBNextItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
	volumioSBNextItem.command = volumioNextCmdId;
	subscriptions.push(volumioSBNextItem);

	volumioSBInfoItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	volumioSBInfoItem.command = volumioInfoCmdId;
	subscriptions.push(volumioSBInfoItem);
	
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	// https://code.visualstudio.com/api/references/icons-in-labels
	volumioSBInfoItem.text = `$(info)`;
	volumioSBInfoItem.show();
	volumioSBNextItem.text = `$(triangle-right)`;
	volumioSBNextItem.show();
	volumioSBPlayItem.text = `$(notebook-execute)`;
	volumioSBPlayItem.show();
	volumioSBPrevItem.text = `$(triangle-left)`;
	volumioSBPrevItem.show();

}

function playPreviousSong() {
	return execVolumioRestApi(`http://${volumioServer}/api/v1/commands/?cmd=prev`);
}
function playNextSong() {
	return execVolumioRestApi(`http://${volumioServer}/api/v1/commands/?cmd=next`);
}

function togglePlayBack() {
	return execVolumioRestApi(`http://${volumioServer}/api/v1/commands/?cmd=toggle`);
}

async function getVolumioState() {
	var axios = require('axios');

	var config = {
		method: 'get',
		url: `http://${volumioServer}/api/v1/getState`,
		headers: { }
	};

	return await axios(config)
		.then((res: { data: any; }) => `${res.data.artist}: ${res.data.title}`)
		.catch((err: any) => console.error(err));
}

async function execVolumioRestApi(urlCmd: string) {

	var axios = require('axios');
	var config = {
		'method': 'GET',
		'url': urlCmd
	};
	return await axios(config)
		.then((res: { data: any; }) => res.data)
		.catch((err: any) => console.error(err));
} 
export function deactivate() {}
