import * as vscode from 'vscode';

const playlists = [{ "playlist": "Electronic Focus",
                      "uri": "spotify:user:spotify:playlist:37i9dQZF1DX0wMD4IoQ5aJ",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Daily Mix 1",
                      "uri": "spotify:user:spotify:playlist:37i9dQZF1E39ASn23kxdwx",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Daily Mix 2",
                      "uri": "spotify:user:spotify:playlist:37i9dQZF1E39XNkmzY1Lgr",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Rina Sawayama",
                      "uri": "spotify:artist:2KEqzdPS7M5YwGmiuPTdr5",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Dua Lipa",
                      "uri": "spotify:artist:6M2wZ9GZgrQXHCFfjv46we",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Sofi Tukker",
                      "uri": "spotify:artist:586uxXMyD5ObPuzjtrzO1Q",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Tove Lo",
                      "uri": "spotify:artist:4NHQUGzhtTLFvgF5SZesLK",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "Bishop Briggs",
                      "uri": "spotify:artist:0yb46jwm7gqbZXVXZQ8Z1e",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "This Zedd",
                      "uri": "spotify:user:spotify:playlist:37i9dQZF1DWVM4VqFGeMe4",
                      "name": "spotify",
                      "service": "spop"
                      },
                      { "playlist": "2021_headphones",
                      "uri": "tidal://mymusic/playlists/az/24dc3aed-f2d1-4cb6-802a-df2a62d4e260",
                      "name": "",
                      "service": "streaming_services"
                      },
                      { "playlist": "2020_Fall",
                      "uri": "tidal://mymusic/playlists/az/774e1c19-12d8-4456-8a24-8f5a8750051c",
                      "name": "",
                      "service": "streaming_services"
                      },
                      { "playlist": "Classical for Studying Radio",
                      "uri": "pandora/stations/?id=21",
                      "name": "mp3",
                      "service": "pandora"
                      }
                      ];
    
export class MoodPlaylistView {
  
	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('moodPlaylistView', { treeDataProvider: MoodTreeProvider(), showCollapseAll: true });
		context.subscriptions.push(view);
    vscode.commands.registerCommand('Volumio.playMood', (resource) => this.playMood(resource));
	}
  private async playMood(resource: string): Promise<void> {
    const result = playlists.find( ({ playlist }) => playlist === resource );

    if (result) {
		var axios = require('axios');
    var config = {
      'method': 'POST',
      'url': `http://volumio.local/api/v1/replaceAndPlay`,
      'headers': { 'Content-Type': 'application/json' },
      'data': `{"name": "${result.name}", "service": "${result.service}", "uri": "${result.uri}"}`
    };
    
    return await axios(config)
      .then((res: { data: any; }) => res.data)
      .catch((err: any) => console.error(err));
    }
  }
}

function MoodTreeProvider(): vscode.TreeDataProvider<{ key: string }> {
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(element ? element.key : "").map(key => getNode(key));;
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key);
			treeItem.id = element.key;
			return treeItem;
		},
		getParent: ({ key }: { key: string }): { key: string } => {
			const parentKey = key.substring(0, key.length - 1);
			return parentKey ? new key(parentKey) : void 0;
		}
	};
}
function getNode(key: string): { key: string } {
	if (!key) {
		return {key: ""};
	}
	return {key: key};
}

function getChildren(key: string): string[] {
	if (!key) {
		const treeItem = new vscode.TreeItem("Focus", vscode.TreeItemCollapsibleState.Collapsed);
		return ["Focus", "Woodworking", "Cooking", "Creative"];
	}
	if (key === "Focus") {
		return ["Electronic Focus", "Classical for Studying Radio"];
	}
	if (key === "Woodworking") {
		return ["Daily Mix 1", "Daily Mix 2"];
	}
	if (key === "Cooking") {
		return ["Rina Sawayama", "Dua Lipa", "Sofi Tukker", "Tove Lo"];
	}
	if (key === "Creative") {
		return ["This Zedd", "2021_headphones", "2020_Fall"];
	}
	return [];
}
function getTreeItem(key: string): vscode.TreeItem {
	if (key === "Focus" || key === "Woodworking" || key === "Cooking" || key === "Creative") {
		return {
			label: key,
			tooltip: `${key}`,
			collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
		};

	} else {
		return {
			label: key,
			tooltip: `Play: ${key}`,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
      command: { command: 'Volumio.playMood', title: "Play Mood", arguments: [key], }
		};
	}
}
