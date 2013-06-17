// Mixins that help with templating/sorting functionality.

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
	// Taken from github gist -- no guarentees...
	mean : function(obj, iterator, context) {
	    if (!iterator && _.isEmpty(obj)) return Infinity;
	    if (!iterator && _.isArray(obj)) return _.sum(obj)/obj.length;
	    if (_.isArray(obj) && !_.isEmpty(obj)) return _.sum(obj, iterator, context)/obj.length;
	},
	// Taken from github gist -- no guarentees...
	median : function(obj, iterator, context) {
		var tmpObj = [];

	    if (_.isEmpty(obj)) return Infinity;

	    if (!iterator && _.isArray(obj)){
	    	tmpObj = _.clone(obj);
	    	tmpObj.sort(function(f,s){return f-s;});
	    } else {
	    	_.isArray(obj) && each(obj, function(value, index, list) {
	    	  tmpObj.push(iterator ? iterator.call(context, value, index, list) : value);
	    	  tmpObj.sort();
	    	});
	    };

	    return tmpObj.length%2 ? tmpObj[Math.floor(tmpObj.length/2)] : (_.isNumber(tmpObj[tmpObj.length/2-1]) && _.isNumber(tmpObj[tmpObj.length/2])) ? (tmpObj[tmpObj.length/2-1]+tmpObj[tmpObj.length/2]) /2 : tmpObj[tmpObj.length/2-1];
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