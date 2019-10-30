import ComplexMergeFieldContainer from './complexMergeFieldContainer';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ComplexMergeField extends Plugin {
	static get requires() {
		return [ ComplexMergeFieldContainer ];
	}
}
