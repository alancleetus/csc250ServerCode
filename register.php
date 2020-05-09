<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$_POST = json_decode(file_get_contents('php://input'), true);

//print_r($_POST);
/*https://thisinterestsme.com/sending-json-via-post-php/*/
if(isset($_POST['cipherText']))
{
	$cText = $_POST['cipherText'];
	//echo $cText;
	//echo file_get_contents("privateKey.txt");
	//API Url
	$url = 'https://athena.ecs.csus.edu/~cleetusa/csc250/RSAUtil.php';
 
	//Initiate cURL.
	$ch = curl_init($url);
 
	//The JSON data.
	$jsonData = array(
    		'cipherText' => $_POST['cipherText'],
		'privateKey' => file_get_contents("privateKey.txt")
	);
 
	//Encode the array into JSON.
	$jsonDataEncoded = json_encode($jsonData);
 
	//Tell cURL that we want to send a POST request.
	curl_setopt($ch, CURLOPT_POST, 1);
 
	//Attach our encoded JSON string to the POST fields.
	curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonDataEncoded);
 
	//Set the content type to application/json
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); 

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

	//Execute the request
	$result = curl_exec($ch);
	
	//print_r($result);

	addkey($result);
	
	curl_close($ch);
}
else{echo "No cipher text found";}

function addKey($key)
{
	if(file_exists('keys.json'))
	{
		$current_data = file_get_contents('keys.json');
        	$array_data = json_decode($current_data, true);
		$extra = json_decode($key, TRUE);
	        $array_data[] = $extra;
        	$final_data = json_encode($array_data);
        	if(file_put_contents('keys.json', $final_data))
        	{
             		echo "Success";
        	}
	}
}

?>
