<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Column toggle: Refresh - jQuery Mobile Demos</title>
	<link rel="stylesheet"  href="../../../css/themes/default/jquery.mobile.css">
	<link rel="stylesheet" href="../../_assets/css/jqm-demos.css">
	<link rel="shortcut icon" href="../../favicon.ico">
	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:300,400,700">
	<script src="../../../js/jquery.js"></script>
	<script src="../../_assets/js/"></script>
	<script src="../../../js/"></script>
	<script>
		$( document ).on( "pageinit", function() {
			$( document ).one( "click", "#add_and_refresh", function () {
				var newRows = "<tr><th>6</th><td><a href=\"http://en.wikipedia.org/wiki/Dr._Strangelove\" data-rel=\"external\">Dr. Strangelove Or How I Learned to Stop Worrying and Love the Bomb</a></td><td>1964</td><td>92%</td><td>74</td></tr><tr><th>7</th><td><a href=\"http://en.wikipedia.org/wiki/The_Graduate\" data-rel=\"external\">The Graduate</a></td><td>1967</td><td>91%</td><td>122</td></tr><tr><th>8</th><td><a href=\"http://en.wikipedia.org/wiki/The_Wizard_of_Oz_(1939_film)\" data-rel=\"external\">The Wizard of Oz</a></td><td>1939</td><td>90%</td><td>72</td></tr><tr><th>9</th><td><a href=\"http://en.wikipedia.org/wiki/Singin%27_in_the_Rain' data-rel=\"external\">Singin\" in the Rain</a></td><td>1952</td><td>89%</td><td>85</td></tr><tr><th>10</th><td class=\"title\"><a href=\"http://en.wikipedia.org/wiki/Inception\" data-rel=\"external\">Inception</a></td><td>2010</td><td>84%</td><td>78</td></tr>";
				
				$( "table#table-column-toggle tbody" )
					// Append the new rows to the body
					.append( newRows )
					// Call the refresh method
					.closest( "table#table-column-toggle" )
					.table( "refresh" )
					// Trigger if the new injected markup contain links or buttons that need to be enhanced
					.trigger( "create" );
				
				// We disable the button to make clear that in this demo we have only one set of rows to inject	
				$( "#add_and_refresh" ).button( "disable" );
			});
		});
	</script>
</head>
<body>
<div data-role="page" class="jqm-demos">

    <div data-role="header" class="jqm-header">
		<h1 class="jqm-logo"><a href="../../"><img src="../../_assets/img/jquery-logo.png" alt="jQuery Mobile Framework"></a></h1>
        <a href="#" class="jqm-navmenu-link" data-icon="bars" data-iconpos="notext">Navigation</a>
        <a href="#" class="jqm-search-link" data-icon="search" data-iconpos="notext">Search</a>
		<?php include( '../../search.php' ); ?>
    </div><!-- /header -->

	<div data-role="content" class="jqm-content">

        <h1>Column toggle: Refresh method</h1>

		<div data-demo-html="true" data-demo-js="true">

			<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
			  <thead>
				<tr>
				  <th data-priority="2">Rank</th>
				  <th>Movie Title</th>
				  <th data-priority="3">Year</th>
				  <th data-priority="1"><abbr title="Rotten Tomato Rating">Rating</abbr></th>
				  <th data-priority="5">Reviews</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <th>1</th>
				  <td><a href="http://en.wikipedia.org/wiki/Citizen_Kane" data-rel="external">Citizen Kane</a></td>
				  <td>1941</td>
				  <td>100%</td>
				  <td>74</td>
				</tr>
				<tr>
				  <th>2</th>
				  <td><a href="http://en.wikipedia.org/wiki/Casablanca_(film)" data-rel="external">Casablanca</a></td>
				  <td>1942</td>
				  <td>97%</td>
				  <td>64</td>
				</tr>
				<tr>
				  <th>3</th>
				  <td><a href="http://en.wikipedia.org/wiki/The_Godfather" data-rel="external">The Godfather</a></td>
				  <td>1972</td>
				  <td>97%</td>
				  <td>87</td>
				</tr>
				<tr>
				  <th>4</th>
				  <td><a href="http://en.wikipedia.org/wiki/Gone_with_the_Wind_(film)" data-rel="external">Gone with the Wind</a></td>
				  <td>1939</td>
				  <td>96%</td>
				  <td>87</td>
				</tr>
				<tr>
				  <th>5</th>
				  <td><a href="http://en.wikipedia.org/wiki/Lawrence_of_Arabia_(film)" data-rel="external">Lawrence of Arabia</a></td>
				  <td>1962</td>
				  <td>94%</td>
				  <td>87</td>
				</tr>
			  </tbody>
			</table>
			<input type="button" id="add_and_refresh" data-role="button" data-icon="refresh" data-theme="c" data-inline="true" value="Add rows &amp; refresh" />

		</div><!-- /data-demo -->

	</div><!-- /content -->

	<div data-role="footer" class="jqm-footer">
		<p class="jqm-version"></p>
		<p>Copyright 2013 The jQuery Foundation</p>
	</div><!-- /footer -->

<?php include( '../../global-nav.php' ); ?>

</div><!-- /page -->
</body>
</html>
