<?php
$response = array();
foreach (glob('/srv/http/nginx/posts/*.html') as $filename) {
	$path = pathinfo($filename);
	$response[] = $path['filename'];
}
echo json_encode($response);
?>
