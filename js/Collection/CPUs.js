define([
	  'Model/CPU'
	, 'mixins'], 

function(CPU) {
	var CPUs = Backbone.SortableCollection.extend({
		model: CPU,
		initialize: function(id) {
			this.url = 'sites/' + id + '/cpu';
		},
		sortTarget: 'tstamp',
		sortOrder: -1
	});

	return CPUs;
});