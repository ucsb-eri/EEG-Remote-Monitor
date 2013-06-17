var App = {
	// Don't forget to update <base> tag in .html document as well.
	// This allows us to use HTML5's pushState API along with mod_rewrites.
	webroot: '/RemoteMon/build/'
};

require.config({
	paths: {
		  'jquery': 'components/jquery/jquery'
		, 'underscore': 'components/underscore/underscore'
		, 'backbone': 'components/backbone/backbone'
		, 'domReady': 'components/requirejs-domready/domReady'
	}
})

define([
	  'jquery'
	, 'underscore'
	, 'backbone'],

function() {
	'use strict';

	require(['View/App']);

	// Random actions.

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