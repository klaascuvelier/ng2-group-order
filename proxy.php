<?php

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept");
        http_response_code(200);
        die('');
    }

    $base = "https://api.meetup.com/2";
    $url = $base . $_REQUEST['url'];
    $headers = getallheaders();

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: " . $headers['Authorization'],
        "Content-Type: " . $headers['Content-Type'],
        "Accept: " . $headers['Accept']
    ));

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);

    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    http_response_code($httpcode);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept");

    echo $body;
?>
