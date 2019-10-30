import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import MergeFieldCommand from './mergeFieldCommand';
import './theme/mergefield.css';

export default class ComplexMergeFieldContainer extends Plugin {
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

		schema.register( 'complexMergeField', {
			isObject: true,
			allowWhere: '$block'
		} );
		schema.register( 'complexContent', {
			isObject: true,
			isLimit: true,
			allowIn: 'complexMergeField',
			allowContentOf: '$root'
		} );
		schema.register( 'originalContent', {
			isObject: true,
			isLimit: true,
			allowIn: 'complexMergeField',
			allowContentOf: '$root'
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		/** Upcasts **/
		conversion.for( 'upcast' ).elementToElement( {
			model: 'complexMergeField',
			view: {
				name: 'section',
				classes: 'complex-merge-field'
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'complexContent',
			view: {
				name: 'div',
				classes: 'complex-content'
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'originalContent',
			view: {
				name: 'div',
				classes: 'original-content'
			}
		} );

		/** End of Upcasts **/

		/** Editing Downcasts **/
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'complexMergeField',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = viewWriter.createContainerElement( 'section', { class: 'complex-merge-field' } );
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'complexContent',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = viewWriter.createEditableElement( 'div', { class: 'complex-content' } );
				return toWidgetEditable( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'originalContent',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = viewWriter.createEditableElement( 'div', { class: 'original-content' } );
				return toWidgetEditable( widgetElement, viewWriter );
			}
		} );

		/** End of Editing Downcasts **/

		/** Data Downcasts **/
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'complexMergeField',
			view: createMergeFieldView
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'complexContent',
			view: {
				name: 'div',
				classes: 'complex-content'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'originalContent',
			view: {
				name: 'div',
				classes: 'original-content'
			}
		} );

		/** End of Data Downcasts **/

		function createMergeFieldView( modelItem, viewWriter ) {
			const mergeFieldView = viewWriter.createContainerElement( 'section', {
				class: 'complex-merge-field'
			} );
			return mergeFieldView;
		}
	}
}
