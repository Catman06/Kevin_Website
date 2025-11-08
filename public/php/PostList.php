<?php
header("Cache-Control: max-age=100");
$response = [];
	foreach (glob("../posts/*.html") as $path) {
    // Get the date for the post
    $content = file_get_contents($path);
    preg_match("/<meta\s+name\s*=\s*['\"]date['\"].+content\s*=\s*['\"](.+)['\"].*\/>/isU", $content, $date);
    // Return the path
    $filename = pathinfo($path)["filename"];
    $item = ["name" => (string) $filename, "date" => $date[1] ?? null];
    $response[] = $item;
  }
echo json_encode($response);
?>
