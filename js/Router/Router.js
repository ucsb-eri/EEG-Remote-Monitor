define([
	  'Collection/Sites'
	, 'Model/Info'
	, 'Collection/Disks'
	, 'Collection/CPUs'
	, 'Collection/Files'
	, 'Collection/Work'
	, 'View/Info'
	, 'View/Graph'],

function(Sites, Info, Disks, CPUs, Files, Work, InfoView, Graph) {
	var Router, router;

	Router = Backbone.Router.extend({
		routes: {
			// Routes basically correspond to server REST paths
			'info/:id':  'info',
			'disk/:id':  'disk',
			'cpu/:id':   'cpu',
			'file/:id': 'file',
			'work/:id':  'work',
		},
		info: function(id) {
			var site = Sites.get(id),
				model = new Info(id),
				view = new InfoView({tpl: '#info-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'info' || id !== routeId) {
					view.remove();
				}
			});

			Sites.activate(id);

			model.fetch({
				success: function() {
					view.render();
				}
			});
		},
		disk: function(id) {
			var site = Sites.get(id),
				model = new Disks(id),
				view = new InfoView({tpl: '#disks-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'disk' || id !== routeId) {
					view.remove();
				}
			});

			Sites.activate(id);

			model.fetch({
				success: function() {
					view.render()
				}
			});
		},
		cpu: function(id) {
			var site = Sites.get(id),
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

			Sites.activate(id);

			model.fetch({
				success: function() {
					view.render();
					graph.render();
				}
			});
		},
		file: function(id) {
			var site = Sites.get(id),
				model = new Files(id),
				view = new InfoView({tpl: '#files-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'file' || id !== routeId) {
					view.remove();
				}
			});

			Sites.activate(id);

			model.fetch({
				success: function() {
					view.render()
					graph.$el.prependTo($('#viewport .data-viz'));
				}
			});
		},
		work: function(id) {
			var site = Sites.get(id),
				model = new Work(id),
				view = new InfoView({tpl: '#work-template', model: model});

			this.on('route', function(route, args) {
				var routeId = args[0];
				if(route !== 'work' || id !== routeId) {
					view.remove();
				}
			});

			Sites.activate(id);


			model.fetch({
				success: function() {
					view.render()
				}
			});
		}
	});

	router = new Router();

	return router;
})