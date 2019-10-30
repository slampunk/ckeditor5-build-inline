import Command from '@ckeditor/ckeditor5-core/src/command';

export default class MergeFieldCommand extends Command {
	execute( { value } ) {
		const editor = this.editor;

		editor.model.change( writer => {
			const mergeField = writer.createElement( 'mergeField', { text: value } );
			editor.model.insertContent( mergeField );
			writer.setSelection( mergeField, 'on' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild( selection.focus.parent, 'mergeField' );

		this.isEnabled = isAllowed;
	}
}
