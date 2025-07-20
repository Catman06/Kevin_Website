<?php
$response = array();
foreach (glob('/srv/http/nginx/posts/*.html') as $filename) {
	$path = pathinfo($filename);
	// Get the meta information from the file
	$content = fread($path, filesize($path));
	$date = preg_match('/<meta name="date".*content="(.+).*\/>/im');
	$categories = preg_match('/<meta name="categories".*content="(.+).*\/>/im');
	$title = preg_match('/<meta name="title".*content="(.+).*\/>/im');
	$blurb = preg_match('/<meta name="blurb".*content="(.+).*\/>/im');
	// Add all the acquired info fields to the response
	$response[$path['filename']] = array("date" => $date, "categories" => $title, "blurb" => $blurb);
}
echo json_encode($response);
?>
