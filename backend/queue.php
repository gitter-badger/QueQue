<?php
	require_once('./functions.php');
	$handle = new db();

	$do = 'current';
	if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
		if (isset($_GET['next']))
			$do = 'next';
	} else if (isset($_GET['max'])) {
		$do = 'max';
	} else if (isset($_GET['access'])) {
		$do = 'access';
	}

	if ($do == 'access')
		$data = $handle->query('{"access" : "' . $_SERVER['REMOTE_ADDR'] . '"}');
	else
		$data = $handle->query('{"queue" : "' . $do . '"}');
	print $data;
?>