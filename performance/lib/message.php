<?php

function sendApi($url, $data = [], $method = 'POST')
{
    if ($method === 'POST') {
        $ch = curl_init($url);

        $count = count($data);

        if ($count > 0) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
    } else {
        $params = '';
        foreach ($data as $key => $datum) {
            if ($params !== '') {
                $params .= '&';
            }

            $params .= $key . '=' . $datum;
        }

        $ch = curl_init($url . '?' . $params);
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    $path = dirname(ROOT) . "/logs/api_log";

    if (!curl_errno($ch)) {
        $getinfo = curl_getinfo($ch);

        file_put_contents($path, "[" . date("D M d H:i:s Y") . "] [code " . $getinfo["http_code"] . "] [agent " . $_SERVER["HTTP_USER_AGENT"] . "] [api " . $url . ($count ? "/" . json_encode($data) : "") . "]\n", FILE_APPEND);

        return [
            "data" => json_decode($result, true),
            "code" => $getinfo["http_code"]
        ];
    } else {
        file_put_contents($path, "[" . date("D M d H:i:s Y") . "] [code xxx] [agent " . $_SERVER["HTTP_USER_AGENT"] . "] [api " . $url . ($count ? "/" . json_encode($data) : "") . "] [message " . curl_error($ch) . "]\n", FILE_APPEND);
    }

    $response = [
        'code' => curl_getinfo($ch)["http_code"],
        'data' => curl_error($ch)
    ];

    curl_close($ch);

    return $response;
}

$request = $_REQUEST;
$method = $_SERVER['REQUEST_METHOD'];
$url = $request['api_url'];
unset($request['api_url']);

$response = sendApi($url, $request);

// set headers
header('Content-Type: application/json');
http_response_code($response['code']);

echo json_encode($response['data']);
