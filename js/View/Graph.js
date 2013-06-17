define(['components/Chart.js/Chart', 'domReady'], function() {
	var Graph = Backbone.View.extend({
		tagName: 'canvas',
		className: 'graph',
		attributes: function() {
			return {
				width: 640,
				height: 300
			};
		},
		options: {
			loadAmount: 20,
			level: 1
		},
		initialize: function(collection) {
			_.bindAll(this, 'loadPrev', 'loadNext');
			this.collection = collection;
		},
		render: function() {
			var ctx    = this.el.getContext('2d'),
				canvas = new Chart(ctx),
				usage  = this.collection.pluck('usage'),
				labels = this.collection.pluck('tstamp'),
				data, back;

			// Calculate the first index to render in arrays.
			back = usage.length - (this.options.loadAmount * this.options.level);
			usage = usage.splice(back, this.options.loadAmount);
			labels = labels.splice(back, this.options.loadAmount);

			_.each(labels, function(label, itr, arr) {
				var date = new Date(label * 1000);
				arr[itr] = date.getDate().toString() + '/' + date.getDay() + '/' + date.getFullYear().toString().slice(2, 4) + ' ' + date.getHours() + ':' + date.getMinutes();
			});

			_.each(usage, function(label, itr, arr) {
				arr[itr] = parseInt(label);
			});

			if(_.mean())

			data = {
				labels: labels,
				datasets: [
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : usage
					}
				]
			}

			canvas.Line(data);

			$('#viewport .data-viz').html(this.$el);

			this.$el.before("<button class='loadMore loadPrev vertical-align'>&#9664;</button>");
			this.$el.after("<button class='loadMore loadNext vertical-align'>&#9654;</button>");

			$('.loadPrev').click(this.loadPrev);
			$('.loadNext').click(this.loadNext);
		},
		loadPrev: function() {
			if(this.collection.length > this.options.level * this.options.loadAmount) {
				this.options.level++;
				this.render();
			}
		},
		loadNext: function() {
			if(this.options.level > 1) {
				this.options.level--;
				this.render();
			}
		},
		remove: function() {
			this.$el.siblings().unbind().remove();
		    Backbone.View.prototype.remove.apply(this, arguments);
		},
	});

	return Graph;
});