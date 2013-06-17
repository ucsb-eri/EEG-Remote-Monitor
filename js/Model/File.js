define(function() {
	var File = Backbone.Model.extend({
		parse: function(response) {
			var date = new Date(response.lastUpdate*1000);
			response.date = date.toUTCString();
			
			return response;
		}
	});

	return File;
});