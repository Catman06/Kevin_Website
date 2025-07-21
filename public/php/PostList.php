<?php
header("Cache-Control: max-age=100");
$response = array();
foreach (glob('/srv/http/nginx/posts/*.html') as $path) {
	// Get the date for the post
	$content = file_get_contents($path);
	preg_match('/<meta name="date".*content="(.+)".*\/>/im', $content, $date);
	// Return the path
	$filename = pathinfo($path)['filename'];
	$item = ["name" => "$filename", "date" => $date[1]];
	$response[] = $item;
}
echo json_encode($response);
?>
