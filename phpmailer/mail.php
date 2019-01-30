<?php
if(isset($_POST['name'])){
    $to = "podosyan.webpartner@gmail.com";
    $subject = "Заявка с сайта Налоги";

    $message = "<html><head><title>Заявка с сайта Налоги</title></head><body>";
    if(isset($_POST['question'])){
        $message.= '<p><b>Ситуация: </b> '.$_POST['question'].'</p>';
    }
    if(isset($_POST['name'])){
        $message.= '<p><b>Имя: </b> '.$_POST['name'].'</p>';
    }
    if(isset($_POST['phone'])){
        $message.= '<p><b>Телефон: </b> '.$_POST['phone'].'</p>';
    }
    $message.= "</body></html>";

// Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
    $headers .= 'From: <podosyan.webpartner@gmail.com>';

    mail($to,$subject,$message,$headers);
}
return true;