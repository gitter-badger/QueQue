<?php
	require_once('./functions.php');
	$handle = new db();

	$do = 'current';
	if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
		if (isset($_GET['next']))
			$do = 'next';
	} else if (isset($_GET['max'])) {
		$do = 'max';
	}

	$data = $handle->query('{"queue" : "' . $do . '"}');
	print $data;
?>