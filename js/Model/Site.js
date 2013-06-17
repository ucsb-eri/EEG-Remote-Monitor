define(function() {
	var Site = Backbone.Model.extend({
		defaults: {
			active: false
		}
	});

	return Site;
});