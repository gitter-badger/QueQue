<?php
	require_once('./functions.php');
	$handle = new db();

	if (isset($_GET['next']) && strpos($handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}'), 'true') !== false) {
		$do = 'next';
	} else if (isset($_GET['max'])) {
		$do = 'max';
	} else if (isset($_GET['access'])) {
		$do = 'access';
	} else {
		$do = 'current';
	}

	if ($do == 'access')
		$data = $handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}');
	else
		$data = $handle->query('{"queue" : "' . $do . '"}');
	print $data;
?>