<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials true");
	header("content-type: application/json");
	echo file_get_contents("summary.json");
?>
