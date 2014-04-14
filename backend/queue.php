<?php
	require_once('./functions.php');
	$handle = new db();

	$parameters = '{}';

	// The access to certain functions is verified in the backend for the connecting socket,
	// there for we have the obligation to verify the client's ip against the access pool before
	// querying the backend for 'next' and 'history' since the PHP is a middle-man twoards the backend.
	// 
	if (isset($_GET['next']) && strpos($handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}'), 'true') !== false) {
		$do = 'next';
	} else if (isset($_GET['max'])) {
		// max returns the highest queue number (the last number in the ticket system)
		$do = 'max';
	} else if (isset($_GET['history']) && strpos($handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}'), 'true') !== false) {
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
	} else {
		$do = 'current';
	}

	if (isset($do))
		$data = $handle->query('{"queue" : "' . $do . '", "parameters" : ' . $parameters . '}');
	print $data;
?>