import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import circlePlusIcon from './circleplus.svg';

export default class AdditionalFields extends Plugin {
	constructor( props ) {
		super( props );

		this.items = new Collection();
	}

	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'additionalFields', this._createView.bind( this ) );

		this.on( 'fields', this._addFields.bind( this ) );

		const { onLoadMergeFields } = editor.config._config;

		onLoadMergeFields( fields => this.fire( 'fields', fields ) );
	}

	_addFields( args, fields ) {
		this.items.clear();

		fields
			.filter( field => field.selectable )
			.forEach( field => {
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
			icon: circlePlusIcon,
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

		const mergeText = evt.source.label;
		const editor = this.editor;

		editor.execute( 'mergeField', { value: mergeText } );
	}
}
