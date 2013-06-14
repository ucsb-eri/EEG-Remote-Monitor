;$(function () {
	'use strict';

	var App = {
		// Don't forget to update <base> tag in .html document as well.
		// This allows us to use HTML5's pushState API along with mod_rewrites.
		webroot: '/RemoteMon/build/'
	};

	// Underscore mixins that help with templating.
	_.mixin({
		stripe: function(list, callback) {
			var i = 0;

			_.each(list, function(item) {
				if(i % 2 == 0) {
					callback(item, 'even');
				} else {
					callback(item, 'odd');
				}
				i++;
			});

			return list;
		},
		multiSort: function(list, prop, dir, callback) {
			var sorted = _.sortBy(list, function(obj) {
				return dir * obj[prop];
			});

			if(callback) {
				_.each(sorted, function(item) {
					callback(item);
				});
			}

			return sorted;
		},
		limitSort: function(list, prop, dir, options, callback) {
			var sorted = _.multiSort(list, prop, dir),
				limited = _.first(sorted, options.page * options.count);

			if(callback) {
				_.each(limited, function(item) {
					callback(item);
				});
			}
			
			return limited;
		}
	});

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
				view = new InfoView({tpl: '#cpu-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'cpu' || id !== routeId) {
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

	Backbone.SortableCollection = Backbone.Collection.extend({
		sorter: function(attr) {
			if(this.sortTarget !== attr) {
				this.sortTarget = attr;
			} else {
				this.sortOrder = (-1 * this.sortOrder);
			}
			this.trigger('resort')
		}
	});

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
		nagName: 'section',
		idAttribute: 'data',
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

			this.$el.appendTo($('#viewport'));

			this.listenTo(this.model, 'resort', this.render);
		},
		resort: function(e) {
			var sortBy = $(e.target).data('bind');

			this.model.sorter(sortBy);
		}
	});

	var AppView = Backbone.View.extend({
		el: '#app',
		events: {
			'click #tasks': 'route',
			'click .site': 'route'
		},
		options: {
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
				id;

			this.options.state = $(e.target).data('task') || this.options.state;

			if(active || $(e.currentTarget).data('id')) {
				id = $(e.currentTarget).data('id') || active.get('id');
				router.navigate(this.options.state +'/' + id, {trigger: true, replace: true});
			}

			return this;
		}
	});
	new AppView();

	// Do things --

	window.sites = sites;
});