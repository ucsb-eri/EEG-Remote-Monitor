define([
	  'Model/Disk'
	, 'mixins'],

function(Disk) {
	var Disks = Backbone.SortableCollection.extend({
		model: Disk,
		initialize: function(id) {
			this.url = 'sites/' + id + '/disks';
		}
	});

	return Disks;
});