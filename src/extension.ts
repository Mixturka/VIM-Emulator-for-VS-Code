import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.vimEmulator', () => {
            vscode.window.showInputBox({ prompt: 'VIM Command' }).then((command) => {
                if (command) {
                    handleVimCommand(command);
                }
            });
        })
    );

    // Register the command to open the command palette
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.vimEmulator.openCommandPalette', () => {
            vscode.commands.executeCommand('workbench.action.showCommands');
        })
    );

    // Bind the 'escape' key to the onEscapePressed command
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('extension.vimEmulator.onEscapePressed', () => {
            openCommandPaletteAndExecuteVimEmulatorCommand();
        })
    );
	context.subscriptions.push(
        vscode.commands.registerCommand('extension.vimEmulator.substitute', () => {
            vscode.window.showInputBox({ prompt: 'Substitute command (e.g., :%s/search/replace/)' }).then((substituteCommand) => {
                if (substituteCommand) {
                    handleSubstituteCommand(substituteCommand);
                }
            });
        })
    );
}
function handleSubstituteCommand(substituteCommand: string) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active editor.');
        return;
    }

    // Parse the substitute command
    const match = substituteCommand.match(/^:%s\/(.+)\/(.+)\/?$/);
    if (!match) {
        vscode.window.showWarningMessage('Invalid substitute command format.');
        return;
    }

    const search = match[1];
    const replace = match[2];

    // Perform substitution
    const text = activeEditor.document.getText();
    const updatedText = text.replace(new RegExp(search, 'g'), replace);

    // Check if any changes were made
    if (text !== updatedText) {
        const fullRange = new vscode.Range(
            activeEditor.document.positionAt(0),
            activeEditor.document.positionAt(text.length)
        );
        activeEditor.edit((editBuilder) => {
            editBuilder.replace(fullRange, updatedText);
        });

        vscode.window.showInformationMessage(`Substitution: ${search} -> ${replace}`);
    } else {
        vscode.window.showInformationMessage('No matches found for substitution.');
    }
}
function openCommandPaletteAndExecuteVimEmulatorCommand() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // Execute VIM Emulator command
        vscode.commands.executeCommand('extension.vimEmulator');
    }

    // Open the command palette
    vscode.commands.executeCommand('workbench.action.showCommands');
}

function openCommandPalette() {
    vscode.commands.executeCommand('extension.vimEmulator.openCommandPalette');
}

function handleVimCommand(command: string) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active editor.');
        return;
    }

    // Check if the command is a substitution command
    if (command.startsWith(':%s')) {
        handleSubstituteCommand(command);
        return;
    }

    // Handle other commands
    switch (command) {
        case ':w':
            vscode.window.showInformationMessage('Saving file');
            activeEditor.document.save();
            break;
        case ':wq':
            vscode.window.showInformationMessage('Saving and quitting');
            activeEditor.document.save().then(() => {
                vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            }, (error) => {
                vscode.window.showErrorMessage(`Error saving file: ${error.message}`);
            });
            break;
        case ':qa':
            vscode.window.showInformationMessage('Closing all files');
            vscode.commands.executeCommand('workbench.action.closeAllEditors');
            break;
        case ':%y':
            vscode.window.showInformationMessage('Yanking all lines');
            vscode.commands.executeCommand('editor.action.clipboardCopyAction');
            break;
        case 'h':
            vscode.window.showInformationMessage('Moving cursor left');
            moveCursorLeft();
            break;
        case 'j':
            vscode.window.showInformationMessage('Moving cursor down');
            moveCursorDown();
            break;
		case 'k':
			vscode.window.showInformationMessage('Moving cursor up');
			moveCursorUp();
			break;
		case 'H':
			vscode.window.showInformationMessage('Moving cursor to the top of the screen');
			moveCursorToTop();
			break;
		case 'M':
			vscode.window.showInformationMessage('Moving cursor to the middle of the screen');
			moveCursorToMiddle();
			break;
		case 'L':
			vscode.window.showInformationMessage('Moving cursor to the bottom of the screen');
			moveCursorToBottom();
			break;
		case 'w':
			vscode.window.showInformationMessage('Jumping forwards to the start of a word');
			jumpToWordStart();
			break;

		case 'W':
			vscode.window.showInformationMessage('Jumping forwards to the start of a word (considering punctuation)');
			jumpToWordStartWithPunctuation();
			break;
		case 'e':
			vscode.window.showInformationMessage('Jumping forwards to the end of a word');
			jumpToWordEnd();
			break;
		case 'E':
			vscode.window.showInformationMessage('Jumping forwards to the end of a word (considering punctuation)');
			jumpToWordEndWithPunctuation();
			break;
		case 'dd':
			vscode.window.showInformationMessage('Deleting current line');
			deleteCurrentLine();
			break;
		case 'vaw':
			vscode.window.showInformationMessage('Visually selecting word');
			visuallySelectWord();
			break;
		case 'u':
			vscode.window.showInformationMessage('Undo');
			vscode.commands.executeCommand('undo');
			break;
        default:
            vscode.window.showWarningMessage(`Unknown VIM command: ${command}`);
            break;
    }
}

function moveCursorDown() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = currentPosition.with(currentPosition.line + 1, currentPosition.character);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function moveCursorUp() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = currentPosition.with(currentPosition.line - 1, currentPosition.character);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function moveCursorLeft() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = currentPosition.with(undefined, currentPosition.character - 1);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function moveCursorToTop() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const newPosition = new vscode.Position(0, 0);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function moveCursorToMiddle() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const middleLine = Math.floor(editor.document.lineCount / 2);
        const newPosition = new vscode.Position(middleLine, currentPosition.character);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function moveCursorToBottom() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const lastLine = editor.document.lineCount - 1;
        const newPosition = new vscode.Position(lastLine, 0);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        editor.revealRange(newSelection);
    }
}

function jumpToWordStart() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = editor.document.getWordRangeAtPosition(currentPosition)?.start;
        if (newPosition) {
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection;
            editor.revealRange(newSelection);
        }
    }
}

function jumpToWordStartWithPunctuation() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = editor.document.getWordRangeAtPosition(currentPosition, /\S+/)?.start;
        if (newPosition) {
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection;
            editor.revealRange(newSelection);
        }
    }
}

function jumpToWordEnd() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = editor.document.getWordRangeAtPosition(currentPosition)?.end;
        if (newPosition) {
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection;
            editor.revealRange(newSelection);
        }
    }
}

function jumpToWordEndWithPunctuation() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = editor.document.getWordRangeAtPosition(currentPosition, /\S+/)?.end;
        if (newPosition) {
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection;
            editor.revealRange(newSelection);
        }
    }
}

function deleteCurrentLine() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit((editBuilder) => {
            editor.selections.forEach((selection) => {
                const line = editor.document.lineAt(selection.start.line);
                editBuilder.delete(line.rangeIncludingLineBreak);
            });
        });
    }
}

function visuallySelectWord() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(currentPosition, /\S+/);
        if (wordRange) {
            const newSelection = new vscode.Selection(wordRange.start, wordRange.end);
            editor.selection = newSelection;
            editor.revealRange(newSelection);
        }
    }
}

export function deactivate() {}
