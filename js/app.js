;$(function () {
	'use strict';

	var App = {
		// Don't forget to update <base> tag in .html document as well.
		// This allows us to use HTML5's pushState API along with mod_rewrites.
		webroot: '/RemoteMon/build/'
	};

	var AppRouter = Backbone.Router.extend({
		routes: {
			// Routes basically correspond to server REST paths
			'info/:id':  'info',
			'disk/:id':  'disk',
			'cpu/:id':   'cpu',
			'file/:id': 'file',
			'work/:id':  'work',
		},
		info: function(id) {
			var site = sites.get(id),
				model = new Info(id),
				view = new InfoView({tpl: '#info-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'info' || id !== routeId) {
					view.remove();
				}
			});

			sites.activate(id);

			model.fetch({
				success: function() {
					view.render();
				}
			});
		},
		disk: function(id) {
			var site = sites.get(id),
				model = new Disks(id),
				view = new InfoView({tpl: '#disks-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'disk' || id !== routeId) {
					view.remove();
				}
			});

			sites.activate(id);

			model.fetch({
				success: function() {
					view.render()
				}
			});
		},
		cpu: function(id) {
			var site = sites.get(id),
				model = new CPUs(id),
				view = new InfoView({tpl: '#cpu-template', model: model}),
				graph = new Graph(model);

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'cpu' || id !== routeId) {
					view.remove();
					graph.remove();
				}
			});

			sites.activate(id);

			model.fetch({
				success: function() {
					view.render();
					graph.render();
				}
			});
		},
		file: function(id) {
			var site = sites.get(id),
				model = new Files(id),
				view = new InfoView({tpl: '#files-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'file' || id !== routeId) {
					view.remove();
				}
			});

			sites.activate(id);

			model.fetch({
				success: function() {
					view.render()
					graph.$el.prependTo($('#viewport .data-viz'));
				}
			});
		},
		work: function(id) {
			var site = sites.get(id),
				model = new Work(id),
				view = new InfoView({tpl: '#work-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'work' || id !== routeId) {
					view.remove();
				}
			});

			sites.activate(id);


			model.fetch({
				success: function() {
					view.render()
				}
			});
		}
	});

	var router = new AppRouter();

	// Models
	var Info = Backbone.Model.extend({
		initialize: function(id) {
			this.url = 'sites/' + id + '/info';
		}
	});

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

	var File = Backbone.Model.extend({
		parse: function(response) {
			var date = new Date(response.lastUpdate*1000);
			response.date = date.toUTCString();
			
			return response;
		}
	});

	var CPU = Backbone.Model.extend({
		parse: function(response) {
			response.tstamp = response.time;
			response.time = new Date(response.time * 1000).toUTCString();

			return response;
		}
	});

	var Site = Backbone.Model.extend({
		defaults: {
			active: false
		}
	});

	// Collections

	var Disks = Backbone.SortableCollection.extend({
		model: Disk,
		initialize: function(id) {
			this.url = 'sites/' + id + '/disks';
		}
	});

	var CPUs = Backbone.SortableCollection.extend({
		model: CPU,
		initialize: function(id) {
			this.url = 'sites/' + id + '/cpu';
		},
		sortTarget: 'tstamp',
		sortOrder: -1
	});

	var Files = Backbone.SortableCollection.extend({
		model: File,
		initialize: function(id) {
			this.url = 'sites/' + id + '/files';
		},
		sortTarget: 'id',
		sortOrder: -1
	});

	var Work = Backbone.SortableCollection.extend({
		initialize: function(id) {
			this.url = 'sites/' + id + '/work';
		},
		sortTarget: 'start',
		sortOrder: -1
	});

	var Sites = Backbone.SortableCollection.extend({
		model: Site,
		url: 'sites/',
		defaultSort: 'id',

		activate: function (id) {
			_.each(this.models, function (model) {
				var bool = (model.get('id') === id);
				model.set('active', bool);
			});
		}
	});
	var sites = new Sites;

	// Views

	var InfoView = Backbone.View.extend({
		tagName: 'section',
		id: 'data',
		events: {
			'click .sortable': 'resort',
			'click .loadMore': 'render'
		},
		options: {
			page: 1,
			count:15
		},
		initialize: function() {
			this.template = _.template($(this.options.tpl).html());
		},
		render: function(e) {
			var html,
				sortTarget = this.model.sortTarget,
				sortOrder  = this.model.sortOrder;

			if(e && $(e.target).hasClass('loadMore')) {
				this.options.page++;
			}

			html = this.template({
					obj: this.model.toJSON(),
					options: this.options,
					sortInfo: {
						target: sortTarget,
						order: sortOrder
					}
				});

			this.$el.html(html);

			if(sortTarget) {
				this.$el.find('.sortable').each(function() {
					var boundTo = $(this).data('bind'),
						sortClass = (sortOrder === 1) ? 'desc' : 'asc',
						className = (boundTo === sortTarget) ? 'sortable sorted ' + sortClass : 'sortable';
					
					this.className = className;
				});
			}

			this.$el.appendTo($('#viewport .content'));

			this.listenTo(this.model, 'resort', this.render);
		},
		resort: function(e) {
			var sortBy = $(e.target).data('bind');

			this.model.sorter(sortBy);
		}
	});

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

	var AppView = Backbone.View.extend({
		el: '#app',
		events: {
			'click #tasks': 'route',
			'click .site': 'route',
			'tap .site': 'route',
			'tap #tasks': 'route',
			'swiperight': 'show',
			'swipeleft': 'hide'
		},
		defaults: {
			state: 'info'
		},
		initialize: function () {
			// Do things
			this.listenTo(sites, 'add change', this.render);
			sites.fetch({
				success: function() {
					Backbone.history.start({pushState: true, root: App.webroot});
				}
			});
		},
		render: function() {
			var template = _.template($('#sites-template').html()),
				html = template({sites: sites.toJSON()});

			$('#sites-list').html(html);
		},
		route: function (e) {
			var active = sites.findWhere({active: true}),
				id, state;

			e.preventDefault();

			state = $(e.target).data('task') || Backbone.history.fragment.split('/')[0] || this.defaults.state;

			if(active || $(e.currentTarget).data('id')) {
				id = $(e.currentTarget).data('id') || active.get('id');
				router.navigate(state +'/' + id, {trigger: true, replace: true});
			}

			return this;
		},
		show: function() {
			var sidebar = $('#sites'),	
				viewport = $('#right');
			$('#app').on('swiperight', function() {
				sidebar.removeClass('bounceOutLeft')
				sidebar.addClass('bounceInLeft');

				viewport.removeClass('bounceInRight')
				viewport.addClass('bounceOutRight');
			});
		},
		hide: function() {
			var sidebar = $('#sites'),	
				viewport = $('#right');
			$('#app').on('swipeleft', function() {
				sidebar.removeClass('bounceInLeft');
				sidebar.addClass('bounceOutLeft');

				viewport.removeClass('bounceOutRight')
				viewport.addClass('bounceInRight');
			});
		}
	});
	new AppView();

	function toggleMobileAnimations() {
		var sidebar = $('#sites'),	
			viewport = $('#right');
		if($(window).width() > 560) {
			sidebar.removeClass('bounceOutLeft');
			sidebar.removeClass('bounceInLeft');
			sidebar.removeClass('animated');

			viewport.removeClass('bounceOutRight');
			viewport.removeClass('bounceInRight');
			viewport.removeClass('animated');
		} else {
			sidebar.addClass('animated');
			viewport.addClass('animated');
		}
	}

	$(window).resize(toggleMobileAnimations);
	$(document).ready(toggleMobileAnimations);

	// Do things --

	window.sites = sites;
});