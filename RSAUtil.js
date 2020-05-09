/*based on code from
 *  * https://vshivam.wordpress.com/2015/06/09/android-javascript-and-python-compatible-rsa-encryption/*/

 function generateRSAKeyPair(keysize) {
    var rsa = forge.pki.rsa;
    var keypair = rsa.generateKeyPair({ bits: keysize, e: 0x10001, workers: -1 });
    return keypair;
}

function encryptRSA(stringToBeEncrypted, publicKey) {
    /*var publicKey = forge.pki.publicKeyFromPem(pubkey);*/

    var buffer = forge.util.createBuffer(stringToBeEncrypted, 'utf8');
    var binaryString = buffer.getBytes();

    var encrypted = publicKey.encrypt(binaryString, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha256.create()
        }
    });
    return forge.util.encode64(encrypted);
}

function decryptRSA(encryptedString, privateKey) {
    var decrypted = privateKey.decrypt(forge.util.decode64(encryptedString), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha256.create()
        }
    });
    return decrypted;
}

function getPubKeyPem(keypair) { return forge.pki.publicKeyToPem(keypair.publicKey); }

function getPrivKeyPem(keypair) { return forge.pki.privateKeyToPem(keypair.privateKey); }


function test2EncDec() {

    let pubKey = forge.pki.publicKeyFromPem(pemPublicKey);
    let privKey = forge.pki.privateKeyFromPem(pemPrivateKey);


    var buffer = forge.util.createBuffer("test string 1", 'utf8');
    var binaryString = buffer.getBytes();
    var encrypted = pubKey.encrypt(binaryString, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha256.create()
        }
    });
    var encString = forge.util.encode64(encrypted);

    console.log(encString);

    console.log(decryptRSA(encString, privKey));
}

function testEncDec() {
    /*
 *         let keyPair = generateRSAKeyPair(1024);
 *                 console.log(getPubKeyPem(keyPair));
 *                         console.log(getPrivKeyPem(keyPair));
 *                             
 *                                     let encMessage = encryptRSA("test message 1", keyPair.publicKey);
 *                                             console.log("encMessage == " + encMessage);
 *                                                 
 *                                                         let decMessage = decryptRSA(encMessage, keyPair.privateKey);
 *                                                                 console.log("decMessage == " + decMessage);
 *                                                                     */

    let pubKey = forge.pki.publicKeyFromPem(pemPublicKey);
    let privKey = forge.pki.privateKeyFromPem(pemPrivateKey);

    let encMessage = encryptRSA("test message 1", pubKey);
    console.log("encMessage == " + encMessage);

    let decMessage = decryptRSA(encMessage, privKey);
    console.log("decMessage == " + decMessage);
}


