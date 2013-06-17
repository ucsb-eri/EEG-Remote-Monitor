define(['mixins'],

function() {
	var Work = Backbone.SortableCollection.extend({
		initialize: function(id) {
			this.url = 'sites/' + id + '/work';
		},
		sortTarget: 'start',
		sortOrder: -1
	});

	return Work;
})