define([
	  'Router/Router'
	, 'domReady'],

function(Router) {

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

	var view = new AppView();

	console.log('hello', view);

	return view;
});