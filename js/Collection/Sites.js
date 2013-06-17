define(['Model/Site', 'mixins'],

function(Site) {
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

	return sites;
});