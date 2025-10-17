import * as vscode from 'vscode';
import { fixOrphans } from './orphanDetector';

export function activate(context: vscode.ExtensionContext) {

	const fixOrphansCommand = vscode.commands.registerCommand('take-in-orphans.fixOrphans', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Brak aktywnego edytora tekstu');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;

		const isSelection = !selection.isEmpty;
		const textRange = isSelection
			? selection
			: new vscode.Range(
				document.positionAt(0),
				document.positionAt(document.getText().length)
			);

		const originalText = document.getText(textRange);
		const fileExtension = document.fileName.split('.').pop();

		const fixedText = fixOrphans(originalText, fileExtension);

		if (originalText === fixedText) {
			vscode.window.showInformationMessage('Nie znaleziono sierot typograficznych do naprawy');
			return;
		}

		const changesCount = (fixedText.match(/&nbsp;/g) || []).length;

		await editor.edit(editBuilder => {
			editBuilder.replace(textRange, fixedText);
		});

		const message = isSelection
			? `Naprawiono ${changesCount} ${changesCount === 1 ? 'sierotę' : 'sierot'} w zaznaczonym tekście`
			: `Naprawiono ${changesCount} ${changesCount === 1 ? 'sierotę' : 'sierot'} w całym dokumencie`;

		vscode.window.showInformationMessage(message);

	});

	context.subscriptions.push(fixOrphansCommand);
}

export function deactivate() {}
