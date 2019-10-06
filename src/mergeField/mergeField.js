import MergeFieldContainer from './mergeFieldContainer';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MergeField extends Plugin {
	static get requires() {
		return [ MergeFieldContainer ];
	}
}
