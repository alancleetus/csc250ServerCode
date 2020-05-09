<?php 
session_start();    
$id =session_id();
?>

<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!--script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script-->
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/forge/0.9.1/forge.min.js"
        integrity="sha256-yXrGIwDKUYCS7/LLjJjlicO5+zzXbW9CAeHpOLEi/rk=" crossorigin="anonymous"></script>
    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js" type="text/javascript"></script>

    <script src="./myScripts.js" type="text/javascript"></script>
    <script src="./RSAUtil.js" type="text/javascript"></script>
    <style>
        #registerButton,
        input {
            width: 100%;
            margin: 10px;
        }

        #loginButton:hover{
            background-color: #89da59;
            color:white;
            border-color:white;
        }

        #loginButton{
            color: #89da59;
            border-color: #89da59;
            background-color:white;
            transition: all .3s ease-in;
            width: 100%;
            margin: 10px;
        }


        #registerButton:hover{
            background-color: #80bd9e;
            color:white;
            border-color:white;
        }

        #registerButton{
            color: #80bd9e;
            border-color: #80bd9e;
            background-color:white;
            transition: all .3s ease-in;
            width: 100%;
            margin: 10px;
        }

	#qrImg{
	    max-width:90%;
	}
    </style>
</head>

<body class="container">
    <section id="regSection" class="container pt-3">

        <h4>Password-less Authentication Using Public Key Cryptography</h4>
        <input id="username" type="text" placeholder="Username" />
        <div class="row">
            <div class="col">
                <button class="btn" id="registerButton" onclick="generateRegisterQR()">Register</button>
            </div>
            <div class="col">
                <button class="btn" id="loginButton" onclick="generateLoginQR()">Login</button>
            </div>
        </div>
	<hr />
	<div class="text-center">
            <p id="currTask"> </p>
	</div>

        <div class="text-center">

	    <img src="" id="qrImg" class="img-responsive">
        </div>
	<br />
    </section>
</body>

</html>
