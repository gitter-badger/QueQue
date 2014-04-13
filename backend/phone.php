<?php
	require_once('./functions.php');

	$handle = new db();
	$data = $handle->query('{"number" : "' . $_SESSION['number'] . '"}');
	print $data;
?>