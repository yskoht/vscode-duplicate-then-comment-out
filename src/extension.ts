import * as vscode from 'vscode';

const lineSeparatorCharacter = (eol: vscode.EndOfLine): string => {
	switch(eol) {
		case vscode.EndOfLine.LF: {
			return '\n';
		}
		case vscode.EndOfLine.CRLF: {
			return '\r\n';
		}
	}
};

const main = async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	const selections = editor.selections;
	const firstSelection = selections[0];
	const lastSelection = selections[selections.length - 1];
	const startLine = editor.document.lineAt(firstSelection.start.line);
	const endLine = editor.document.lineAt(lastSelection.end.line);
	const range = new vscode.Range(startLine.range.start, endLine.range.end);
	const text = editor.document.getText(range);

	await vscode.commands.executeCommand('editor.action.addCommentLine');

	const lsc = lineSeparatorCharacter(editor.document.eol);
	const nextLinePosition = new vscode.Position(endLine.range.end.line + 1, 0);
	editor.edit(editBuilder => {
		editor.selection = new vscode.Selection(nextLinePosition, nextLinePosition);
		if (editor.document.lineCount === nextLinePosition.line) {
			editBuilder.insert(nextLinePosition, lsc);
		}
		editBuilder.insert(nextLinePosition, text + lsc);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.duplicateThenCommentOut', main);
	context.subscriptions.push(disposable);

}

export function deactivate() {}
