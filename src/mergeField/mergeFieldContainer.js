import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import MergeFieldCommand from './mergeFieldCommand';
import './theme/mergefield.css';

export default class MergeFieldContainer extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		this.editor.commands.add( 'mergeField', new MergeFieldCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'mergeField', {
			isObject: true,
			isInline: true,
			allowWhere: '$text',
			allowAttributes: [ 'text', 'value', 'required' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'merge-field' ]
			},
			model: ( viewElement, modelWriter ) => {
				const text = viewElement.getChild( 0 ).data.slice( 0 );
				return modelWriter.createElement( 'mergeField', { text } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'mergeField',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = createMergeFieldView( modelItem, viewWriter );
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'mergeField',
			view: createMergeFieldView
		} );

		function createMergeFieldView( modelItem, viewWriter ) {
			const text = modelItem.getAttribute( 'text' );
			const mergeFieldView = viewWriter.createContainerElement( 'span', {
				class: 'merge-field'
			} );

			const innerText = viewWriter.createText( text );
			viewWriter.insert( viewWriter.createPositionAt( mergeFieldView, 0 ), innerText );
			return mergeFieldView;
		}
	}
}
