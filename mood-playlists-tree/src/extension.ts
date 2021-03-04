import * as vscode from 'vscode';
import { MoodPlaylistView } from './moodPlaylistView';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "mood-playlists-tree" is now active!');
	// Test View
	new MoodPlaylistView(context);
}

export function deactivate() {}
