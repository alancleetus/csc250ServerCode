const pemPublicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDgiQUNScodRIb42AX2EuXqyoUUKOXa6+AohOMQgeVO0+JXErIzGeFeTV0zA3RSbPF/ZV5E8q8R8Sk9zCL6cVXJqW76NQc19/IWAmLkVY5rtRJqlQbY/LWRz5DGo6bLgkd7bzAV57VGKkvyg2qrBmRZ1+4hVn3K9Bt2sH0jlxn8wIDAQAB`;

const pemPrivateKey = `MIICWwIBAAKBgQCDgiQUNScodRIb42AX2EuXqyoUUKOXa6+AohOMQgeVO0+JXErIzGeFeTV0zA3RSbPF/ZV5E8q8R8Sk9zCL6cVXJqW76NQc19/IWAmLkVY5rtRJqlQbY/LWRz5DGo6bLgkd7bzAV57VGKkvyg2qrBmRZ1+4hVn3K9Bt2sH0jlxn8wIDAQABAoGAJ0mq86qJf0myVkiQfa8trisBkD4jEWqnbNt+0YkscMXeViAPa3u9dZ+ne7Q2cI7/OSgwDpL+H0+ljM8YXsRBIv35GglaLTQqb/l5+B/dow1ri/UFWYEYL0ccFjT0vJUvfxLhiP+NSz5ohtxQLyTE/pDxEa49fdD/kYkTXB9O3ckCQQDs9ND0SaJWzHcMS2C7B3ZN5uc/nvwp2UYi9G+xk8stHocMmh7OQjuDOkaQuqbeuKKWlPuXhEA2pPDjE1wNmr/XAkEAjhPRmK9D1QlGIXiqI8gTh3BoC3oAgeZoalPgZKpn5ktNsUJGTz0NVF+2ztNvDxslXcYdQ2j0QtTsUiNKImSFRQJADjaFDhIYnbI39dHTpIRHEVcnScakg3IX5eLZjEI8LqGlIhlgfai1XyKwtt+rQLK8deHL0YPKQjzUghpYLCy7EwJAMxhbi26UlXvlVcpAXefpZg79zArPPegv6vVJQMqr3P197l6oTHznW02kv9L4INWhZY0HHyQSnCpY5t08HwxJhQJAVdZqTne//Bsr0pq3LAzS1SgHjaYIcv5+JhDPSdSpg/naPrmxv8pf0Ft2C+jMFn+4SD3B/cEK+o6TGwg6kS7WSg==`;

function generateRegisterQR() {
   document.getElementById('currTask').innerHTML="LOADING...";
    $('#qrImg').attr('src', '');
    let token = {"userName": document.getElementById("username").value,
		"websiteName":"csc250",
		"webPubKey":pemPublicKey,
		"returnLink":"https://athena.ecs.csus.edu/~cleetusa/csc250/register.php"
		 };

    console.log(JSON.stringify(token));

    let baseURL = 'https://api.qrserver.com/v1/create-qr-code/?data=';
    let config = '&size=1000x1000';
    document.getElementById('currTask').innerHTML="SCAN REGISTRATION QR CODE";
    $('#qrImg').attr('src', baseURL + encodeURIComponent(JSON.stringify(token)) + config);
}

function generateLoginQR() {
    document.getElementById('currTask').innerHTML="LOADING...";
    $('#qrImg').attr('src', '');
    let username = document.getElementById("username").value; 
   
    //Step 1: generate token 
    let token = {"userName": username,
                "sessionKey": document.cookie.match(/PHPSESSID=[^;]+/)[0],
		"returnLink": "https://athena.ecs.csus.edu/~cleetusa/csc250/login.php"};
    
    console.log("Login token: "+JSON.stringify(token));

    //Step2: get user public key
    $.getJSON("keys.json", (json) => { 
 	return json
    }).then((data)=>{
	return data.find(d => {return (d[username]!=null)})
    }).then((data)=> {
	return data[username];
    }).then((userPublicKey)=>{
	//Step 3: sign token using server privatekey
	$.ajax({
  	    url: "RSAUtil.php", 
    	    type: "POST",
    	    data: JSON.stringify({"plainText":JSON.stringify(token), "privateKey":pemPrivateKey}),
	}).done((signedToken)=>{
	    console.log("signedToken: "+signedToken);
  	    //Step 4: enc signed token using user public key
	    $.ajax({
		url: "RSAUtil.php", 
		type: "POST",
		data: JSON.stringify({"plainText":signedToken, "publicKey":userPublicKey}),
	    }).done((encToken)=>{
		//Step 5: show modal
		console.log("encToken: "+encToken);

		/*https://stackoverflow.com/a/56213543*/
		let baseURL = 'https://api.qrserver.com/v1/create-qr-code/?data=';
		let config = '&size=1000x1000';
	        document.getElementById('currTask').innerHTML="SCAN LOGIN QR CODE";
		$('#qrImg').attr('src', baseURL + encodeURIComponent(encToken) + config);
                
		//Step 6: check if authenticated 
		checkLoginLoop();
	    }).fail((jqXHR, textStatus, errorThrown)=>{console.log("Error encrypting text")})	
	}).fail((jqXHR, textStatus, errorThrown)=> {console.log("Error signing text")})
    });

}

function getUserPublicKey() { 
    let username = document.getElementById("username").value;
    $.getJSON("keys.json", function(json) {
    	for(let i = 0; i<json.length; i++){
            let obj = json[i]
            if(obj[username] != null){
		key = obj[username];
	    }
	}
    }); 
    return key;
}

function checkLoginLoop(){
    const currSessionKey = document.cookie.match(/PHPSESSID=[^;]+/)[0];
	let cnt = 0;
	setInterval(function(){
	    $.getJSON("sessions.json", function(json) {
		console.log(json)
	        console.log(json.sessionKey);
	
		for(let i = 0; i<json.length; i++){
		let obj = json[i]	
		console.log(obj.sessionKey)
		if(obj.sessionKey == currSessionKey)
			window.location = '/~cleetusa/csc250/success.php'
		}
		cnt++;
		if(cnt == 12)
			window.location = '/~cleetusa/csc250/faliure.php'

    	    });
		
    	}, 5000);
}

$(document).ready(function() {
  $.ajaxSetup({ cache: false });
});
