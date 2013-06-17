define(['domReady'],

function() {
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

	return InfoView;
});