define(function() {
	var CPU = Backbone.Model.extend({
		parse: function(response) {
			response.tstamp = response.time;
			response.time = new Date(response.time * 1000).toUTCString();

			return response;
		}
	});

	return CPU;
});