<?php
	session_start();	
	/*
		TODO: Write a more advanced security-check
		TODO: Switch to $_POST !!!
	*/
	if (isset($_GET['number']) && isset($_GET['number'][12])) {
		die('Unwanted phone-number inserted');
	}

	function sanetizePhoneNumber($nr) {
		if (substr($nr,0,1) == '+' && strlen($nr) == 12)
			$nr = '0' . substr($nr, 3);
		if (!is_numeric($nr))
			die('"Number" contains characters (should be digits only)!');
		return $nr;
	}

	class db {
		public $handle = NULL;
		private function connect() {
			$this->handle = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die('Could not create backend-socket!');
			socket_connect($this->handle, '127.0.0.1', 7113) or die('Could not connect to backend');
		}
		
		function query($query) {
			$this->connect();
			if(isset($this->handle)) {
				socket_send($this->handle, $query, strlen($query), 0);
				socket_recv($this->handle, $data, 8192, MSG_WAITALL);
				socket_close($this->handle);
			} else {
				$data = 'Error querying backend';
			}
			$this->handle = NULL;
			return $data;
		}
	}

	if (isset($_GET['number']))
		$_SESSION['number'] = sanetizePhoneNumber($_GET['number']);
?>