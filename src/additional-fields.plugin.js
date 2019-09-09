import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class AdditionalFields extends Plugin {
	constructor( props ) {
		super( props );

		this.items = new Collection();
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		const editor = this.editor;

		editor.ui.componentFactory.add( 'additionalFields', this._createView.bind( this ) );

		this.on( 'fields', this._addFields.bind( this ) );

		const { loadAdditionalFields = ( () => Promise.resolve() ) } = editor.config._config.additionalFields;
		loadAdditionalFields().then( fields => this.fire( 'fields', fields ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'line', {
			isObject: true,
			inheritAllFrom: '$block'
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: 'line',
			view: {
				name: 'p',
				classes: 'line'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'line',
			view: {
				name: 'p',
				classes: 'line'
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'line',
			view: ( modelElement, viewWriter ) => {
				const line = viewWriter.createContainerElement( 'p', { class: 'line' } );
				return toWidget( line, viewWriter );
			}
		} );
	}

	_addFields( args, fields ) {
		this.items.clear();

		fields.forEach( field => {
			const item = {
				type: 'button',
				model: new Model( {
					label: field.label,
					withText: true,
					templateText: field.templateText
				} )
			};

			this.items.add( item );
		} );
	}

	_createView( locale ) {
		const view = createDropdown( locale );

		view.buttonView.set( {
			isOn: false,
			label: 'Additional fields for use',
			icon: imageIcon,
			tooltip: true
		} );

		view.extendTemplate( {
			attributes: {
				class: 'ck-alignment-dropdown'
			}
		} );

		addListToDropdown( view, this.items );

		view.on( 'execute', this._appendAdditionalText.bind( this ) );

		return view;
	}

	_appendAdditionalText( evt ) {
		if ( !evt.source || !evt.source.templateText ) {
			return;
		}

		const fieldText = evt.source.templateText;
		const editor = this.editor;

		editor.model.change( writer => {
			const caretPosition = editor.model.document.selection.getFirstPosition();
			writer.insertText( fieldText, caretPosition );
		} );
	}
}
