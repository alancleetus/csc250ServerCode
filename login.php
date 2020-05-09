<?php

//https://www.webslesson.info/2016/04/append-data-to-json-file-using-php.html

if(file_exists('sessions.json'))
{
	$current_data = file_get_contents('sessions.json');
        $array_data = json_decode($current_data, true);
	//decrypt using server private key
	//decrypt using user public key
	$extra = json_decode(file_get_contents('php://input'), TRUE);
	
        $array_data[] = $extra;
        $final_data = json_encode($array_data);
        if(file_put_contents('sessions.json', $final_data))
        { 
	     echo "Success";
        }
}

?>

 
