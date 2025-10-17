import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Take in Orphans Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('undefined_publisher.take-in-orphans'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('undefined_publisher.take-in-orphans');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		assert.ok(extension?.isActive);
	});

	test('Command should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		const hasCommand = commands.includes('take-in-orphans.fixOrphans');
		assert.ok(hasCommand, 'Command "take-in-orphans.fixOrphans" should be registered');
	});

	suite('Integration Tests', () => {
		let document: vscode.TextDocument;
		let editor: vscode.TextEditor;

		setup(async () => {
			document = await vscode.workspace.openTextDocument({
				content: '',
				language: 'plaintext'
			});
			editor = await vscode.window.showTextDocument(document);
		});

		teardown(async () => {
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		});

		test('Should fix orphans in active editor', async () => {
			const testText = 'To jest tekst a dalszy tekst';
			const expectedText = 'To jest tekst a&nbsp;dalszy tekst';

			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), testText);
			});

			// Execute the command
			await vscode.commands.executeCommand('take-in-orphans.fixOrphans');

			const resultText = editor.document.getText();
			assert.strictEqual(resultText, expectedText);
		});

		test('Should fix orphans in selection only', async () => {
			const testText = 'To jest a tekst i drugi a tekst';
			const expectedText = 'To jest a&nbsp;tekst i drugi a tekst';

			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), testText);
			});

			// Select only first part
			editor.selection = new vscode.Selection(
				new vscode.Position(0, 0),
				new vscode.Position(0, 15) // "To jest a tekst"
			);

			await vscode.commands.executeCommand('take-in-orphans.fixOrphans');

			const resultText = editor.document.getText();
			assert.strictEqual(resultText, expectedText);
		});

		test('Should handle HTML files correctly', async () => {
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

			const htmlDoc = await vscode.workspace.openTextDocument({
				content: '<p>To jest a tekst</p>',
				language: 'html'
			});
			const htmlEditor = await vscode.window.showTextDocument(htmlDoc);

			await vscode.commands.executeCommand('take-in-orphans.fixOrphans');

			const resultText = htmlEditor.document.getText();
			assert.strictEqual(resultText, '<p>To jest a&nbsp;tekst</p>');

			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		});

		test('Should show message when no orphans found', async () => {
			const testText = 'This is English text without Polish orphans.';

			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), testText);
			});

			// Mock showInformationMessage to capture the message
			let messageShown = '';
			const originalShowInformationMessage = vscode.window.showInformationMessage;
			vscode.window.showInformationMessage = (message: string) => {
				messageShown = message;
				return Promise.resolve(undefined);
			};

			await vscode.commands.executeCommand('take-in-orphans.fixOrphans');

			// Restore original method
			vscode.window.showInformationMessage = originalShowInformationMessage;

			assert.ok(messageShown.includes('Nie znaleziono sierot'));
		});
	});
});
