all:
	cd jquery-mobile && npm install
	cd jquery-mobile && grunt --modules=events/touch --force
	cp jquery-mobile/dist/jquery.mobile.js jquery-mobile-events.js
	rm -fr jquery-mobile/dist
