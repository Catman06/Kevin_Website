<?php
header("Cache-Control: max-age=86400");
$response = [];
try {
    $filename = $_GET["url"];
    $path = "../posts/$filename.html";
    // Get the meta information from the file
    $content = file_get_contents($path);
    preg_match("/<meta\s+name\s*=\s*['\"]date['\"].+content\s*=\s*['\"](.+)['\"].*\/>/isU", $content, $date);
    preg_match(
        "/<meta\s+name\s*=\s*['\"]categories['\"].+content\s*=\s*['\"](.+)['\"].*\/>/isU",
        $content,
        $categories,
    );
    preg_match("/<meta\s+name\s*=\s*['\"]title['\"].+content\s*=\s*['\"](.+)['\"].*\/>/isU", $content, $title);
    preg_match("/<meta\s+name\s*=\s*['\"]blurb['\"].+content\s*=\s*['\"](.+)['\"].*\/>/isU", $content, $blurb);
    // Add all the acquired info fields to the response
    $response += [
        "date" => $date[1] ?? null,
        "categories" => explode(",", $categories[1] ?? null),
        "title" => $title[1] ?? null,
        "blurb" => $blurb[1] ?? null,
    ];
} catch (Exception $ex) {
    $response["error"] = $ex;
}

echo json_encode($response);
?>
