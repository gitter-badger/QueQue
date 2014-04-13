<?php
	require_once('./functions.php');
	$handle = new db();

	// Temporary solution called $extra
	// This entire block will be replaced by a switch case later on.
	$extra = '{}';
	if (isset($_GET['next']) && strpos($handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}'), 'true') !== false) {
		$do = 'next';
	} else if (isset($_GET['max'])) {
		$do = 'max';
	} else if (isset($_GET['access'])) {
		$do = 'access';
	} else if (isset($_GET['history'])) {
		$do = 'history';
		if (isset($_GET['offset']))
			$extra = '{"offset" : "' . $_GET['offset'] . '"}';
	} else {
		$do = 'current';
	}

	if ($do == 'access')
		$data = $handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}');
	else
		$data = $handle->query('{"queue" : "' . $do . '", "parameters" : ' . $extra . '}');
	print $data;
?>