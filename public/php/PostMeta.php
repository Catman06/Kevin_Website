<?php
header("Cache-Control: max-age=86400");
$response = [];
try {
    $filename = $_GET["url"];
    $path = "../posts/$filename.html";
    // Get the meta information from the file
    $content = file_get_contents($path);
    preg_match('/<meta name="date".*content="(.+)".*\/>/im', $content, $date);
    preg_match(
        '/<meta name="categories".*content="(.+)".*\/>/im',
        $content,
        $categories,
    );
    preg_match('/<meta name="title".*content="(.+)".*\/>/im', $content, $title);
    preg_match('/<meta name="blurb".*content="(.+)".*\/>/im', $content, $blurb);
    // Add all the acquired info fields to the response
    $response += [
        "date" => $date[1],
        "categories" => explode(",", $categories[1]),
        "title" => $title[1],
        "blurb" => $blurb[1],
    ];
} catch (Exception $ex) {
    $response["error"] = $ex;
}

echo json_encode($response);
?>
