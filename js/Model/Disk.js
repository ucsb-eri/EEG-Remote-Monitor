define(function() {
	var Disk = Backbone.Model.extend({
		parse: function(response) {
			response.percent = response.used.percent;
			response.total   = response.used.string;
			response.used    = parseInt(response.total) * response.percent / 100;
			response.time    = new Date(response.tstamp * 1000).toUTCString();

			return response;
		},
		initialize: function() {
			this.on('change:percent', this.getColor);
			this.getColor();
		},
		getColor: function() {
			var status = this.get('percent'),
				color;

			if(status < 30) {
				color = 'blue';
			} else if(status < 50) {
				color = 'green';
			} else if(status < 75) {
				color = 'yellow';
			} else {
				color = 'red';
			}

			this.set('color', color);
		}
	});

	return Disk;
});