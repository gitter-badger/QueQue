<?php
	
	/*
		Write a more advanced security-check
	*/
	if (isset($_POST['phone']) && isset($_POST['phone'][12])) {
		die('Unwanted phone-number inserted');
	}

	function sanetizePhoneNumber($nr) {
		if (substr($nr,0,1) == '+' && strlen($nr) == 12)
			$nr = '0' . substr($nr, 3);
		return $nr;
	}

	$phone = sanetizePhoneNumber($_POST['phone']);
?>