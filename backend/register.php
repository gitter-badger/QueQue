<?php
	require_once('./functions.php');

	$handle = new db();
	$data = $handle->query('{"number" : "' . $_SESSION['phone'] . '"}');
	print $data . '<br>';
	$data = $handle->query('{"queue" : "current"}');
	print $data . '<br>';
	$data = $handle->query('{"queue" : "next"}');
	print $data . '<br>';
	$data = $handle->query('{"queue" : "next"}');
	print $data . '<br>';
?>