//check if publickey and private key exists

    //if not generate them
        //save them in the filesystem

    //else just generate the password

const crypto2 = require('crypto2');
const fs = require('fs');

const path = '/keys/';//id_rsa';
const publicFileName = path + "publicEnigma.pub";
const privateFileName = path + "privateEnigma";
let privateKey = ""
let publicKey = ""

const in_params = process.argv.slice(2)

let writeToFile = function(path, key){
    fs.writeFile(path, key, 'utf8', (err)=>{
        if(err) throw err;
        else{
            return true;
        }
    })
}

let createKeyPairs = function(callback){
    crypto2.createKeyPair().then(
        result =>{
            privateKey = result.privateKey;
            publicKey = result.publicKey;
            writeToFile(publicFileName, publicKey);
            writeToFile(privateFileName, privateKey);
            callback(in_params);
        }
    )
}

let ifExists = function(fle1, fle2){
    fs.stat(fle1,(err,stats)=>{
        if(err){
            createKeyPairs(encrypt_decrypt);
            console.log('creating the key ' + fle1);
        }else{
            fs.stat(fle2, (err, stats)=>{
                if(err){
                    createKeyPairs(encrypt_decrypt);
                    console.log('creating the key ' + fle2);
                }else{
                    //just load keys if they already exist.
                    loadKeys(encrypt_decrypt);
                }
            })
        }
        
    })
    
}

let loadKeys = function(callback){
    if(publicKey.length < 1){
        crypto2.readPublicKey(publicFileName).then(
            result => {publicKey = result;
            crypto2.readPrivateKey(privateFileName).then(
                result=>{privateKey = result;
                callback(in_params)
                }
            )
            }
        )
    }else{
        console.log("Keys were just generated !")
        callback(in_params)
    }
}

let encrypt_decrypt = function(in_args){
    if(in_args[0] == 'encrypt'){
        if(in_args[1]){
            crypto2.encrypt.rsa(in_args[1],publicKey).then(
                result=>{
                    console.log(result)
                },
                error=>{console.log(error)}
            )
        }else{
            console.log("")
        }
    }else if(in_args[0] == 'decrypt'){
        if(in_args[1]){
            crypto2.decrypt.rsa(in_args[1],privateKey).then(
                result=>{
                    console.log("result:",result)
                },
                error=>{console.log(error)}
            )
        }else{
            console.log("")
        }
    }
}


ifExists(publicFileName, privateFileName);





