<?php
	require_once('./functions.php');
	$handle = new db();

	$parameters = '{}';
	// if 'next' is given, we can also query the backend for access permissions.
	// the access is also verified in the backend but i'll leave the function here as an example.
	if (isset($_GET['next']) && strpos($handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}'), 'true') !== false) {
		$do = 'next';
	} else if (isset($_GET['max'])) {
		// max returns the highest queue number (the last number in the ticket system)
		$do = 'max';
	} else if (isset($_GET['history'])) {
		// History returns the the last 10 items of the ticket system
		// unless a offset is given, then it's position -10+offset that's retrieved.
		$do = 'history';
		if (isset($_GET['offset']))
			$parameters = '{"offset" : "' . $_GET['offset'] . '"}';
	} else if (isset($_GET['access'])) {
		// == Access checks weither or not the client IP has
		// == access to modify/manipulate the ticket system.
		// ==
		// == Consider moving this into access.php or something similar.
		// == It breaks the syntax of $do and the JSON data in general,
		// == either rework the query system of queue.php or move this one
		// == particular function into it's own atmosphere. 
		$data = $handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}');
	}

	if (isset($do))
		$data = $handle->query('{"queue" : "' . $do . '", "parameters" : ' . $parameters . '}');
	print $data;
?>