<?php
header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $from_mail = "contact@video-mp4.com";
        $from_name = "amisd";
        
        $subject = trim($_GET["subject"]);
        $email = filter_var(trim($_GET["email"]), FILTER_SANITIZE_EMAIL);
        $message = preg_replace_callback(
        '/[A-Z]+/',
        function ($matches) {
        $character = reset($matches);
        return '<br> - ' . $character;
         },
        $_GET["data"]
        );
       
        if ( !filter_var($email, FILTER_VALIDATE_EMAIL) OR empty($subject) OR empty($message)) {

            http_response_code(400);
            echo "notcompleted";
            exit;
        }
        
 
 
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

 
    $headers .= 'From: <'.$from_mail.'>' . "\r\n";

 
        if (mail($email,$subject,$message,$headers)) {

            http_response_code(200);
            echo "Un email a été bien envoyé";
        } else {

            http_response_code(500);
            echo "ko";
        }

        } else {

            http_response_code(403);
            echo "ko";
}
 