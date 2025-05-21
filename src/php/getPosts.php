<?php
	$out = array();
	foreach (glob("../../posts/*.html") as $filename) {
		echo pathinfo($filename);
	}
?>