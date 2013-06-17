define(function() {
	var Info = Backbone.Model.extend({
		initialize: function(id) {
			this.url = 'sites/' + id + '/info';
		}
	});

	return Info;
});