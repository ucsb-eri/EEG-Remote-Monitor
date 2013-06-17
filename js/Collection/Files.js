define([
	  'Model/File'
	, 'mixins'],

function(File) {
	var Files = Backbone.SortableCollection.extend({
		model: File,
		initialize: function(id) {
			this.url = 'sites/' + id + '/files';
		},
		sortTarget: 'id',
		sortOrder: -1
	});

	return Files;
});