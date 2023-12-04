# VIM Emulator for VS Code

![VIM Emulator Logo](icon.png)

## Description

The VIM Emulator is a simple extension for Visual Studio Code that brings VIM-like functionalities to your code editor. If you're a fan of VIM and want to leverage its powerful keyboard shortcuts and commands within VS Code, this extension is for you.

## Features

- **VIM Command Input**: Access VIM commands through a dedicated input box.

**To Open command-line press *esc***
  
***Supported Commands***:
```
- esc - enter command input mode
- :w - Save file
- :wq - Save file and quit
- :qa - Close all files
- :%y - Yank (copy) all lines
- h - Move cursor left
- j - Move cursor down
- k - Move cursor up
- H - Move cursor to the top of the screen
- M - Move cursor to middle of the screen
- L - Move cursor to the bottom of the screen
- w - Jump to word start
- W - Jump to word start (consider punctuation)
- e - Jump to the end of the word
- E - jump to the end of the word (consider punctuation)
- dd - Delete current line
- vaw - Select word visually
- u - undo
```
- **Open Command Palette**: Quickly open the VS Code command palette with a VIM-style command.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl+Shift+X`).
3. Search for "VIM Emulator".
4. Click "Install" to install the extension.
5. Reload VS Code to activate the extension.

**OR**
Download ***vim-emulator-0.0.1.vsix*** file from github and install extension from VSIX file in VS Code.

## Usage

- Open the command palette: Press `Escape` in the editor or use the dedicated command
- Enter VIM commands in the provided input box.

## Author

**M3108 Kozlenko Ivan Denisovich**

## License

This extension is licensed under the [MIT License](LICENSE).

## Issues and Contributions

If you encounter any issues or have suggestions for improvements, please [open an issue](link-to-issues) on GitHub. Contributions are welcome!

---

**Enjoy your VIM experience in Visual Studio Code!**
