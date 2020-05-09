<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

    include_once 'phpseclib1/Math/BigInteger.php';
    include_once 'phpseclib1/Crypt/RSA.php';

//print_r($_REQUEST);
//print_r(json_decode(file_get_contents("php://input")));	
    $rsa= new Crypt_RSA();
    $rsa->setEncryptionMode(CRYPT_RSA_ENCRYPTION_OAEP);
    $rsa->setHash("sha256");
    $rsa->setMGFHash("sha1");

    $_POST = json_decode(file_get_contents('php://input'), true);

    //RSA ENCRYPT
    if(isset($_POST['plainText'], $_POST['privateKey'])){
        $rsa->loadKey($_POST['privateKey']);
        $cipherText = $rsa->encrypt($_POST['plainText']);
        echo base64_encode($cipherText);
    }
    else if(isset($_POST['plainText'], $_POST['publicKey'])){
        $rsa->loadKey($_POST['publicKey']);
        $cipherText = $rsa->encrypt($_POST['plainText']);
        echo base64_encode($cipherText);
    }
    //RSA DECRYPT
    else if(isset($_POST['cipherText'], $_POST['publicKey'])){    
        $rsa->loadKey($_POST['publicKey']);
        $plainText = $rsa->decrypt(base64_decode($_POST['cipherText']));
        echo $plainText;
    }
    else if(isset($_POST['cipherText'], $_POST['privateKey'])){
        $rsa->loadKey($_POST['privateKey']);
        $plainText = $rsa->decrypt(base64_decode($_POST['cipherText']));
        echo $plainText;
    }
    else { echo "field not set"; }
/*
	echo (isset($_POST['publicKey'])? 'publicKey set': 'publicKey not set';
	echo (isset($_POST['privateKey'])? 'privateKey set': 'privateKey not set';
	echo (isset($_POST['plainText'])? 'plainText set': 'plainText not set';
	echo (isset($_POST['cipherText'])? 'cipherText set': 'cipherText not set';
   /* 

    //RSA SIGN
    else if(isset($_POST['document'], $_POST['privateKey'])){ 
        $rsa->loadKey($_POST['privateKey']);
        $signature = $rsa->sign($_POST['document']);
        echo base64_encode($signature);
    }
    //RSA VERIFY
    else if(isset($_POST['plainText'], $_POST['signature'], $_POST['publicKey'])){ 
        $rsa->loadKey($_POST['publicKey']);
        echo $rsa->verify($_POST['plainText'], base64_decode($_POST['signature']))? 'verified':'unverified';
    }
    else{
	echo "Fields Not Set";
    }  
*/
?>

