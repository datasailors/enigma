//check if publickey and private key exists

    //if not generate them
        //save them in the filesystem

    //else just generate the password
const crypto2 = require('crypto2');
const crypto = require('crypto');
const fs = require('fs');
let argv = require('minimist')(process.argv.slice(2));

function CryptoStr(){
    const path = '/keys/';
    const publicFileName = path + 'publicEnigma.pub';
    const privateFileName = path + 'privateEnigma';
    let privateKey = '';
    let publicKey = '';
    const cipherFileLocation = path + 'Ciphered.PWD'


    let createFile = function(path, data){
        fs.writeFile(path, data, 'utf8', (err)=>{
            if(err) throw err;
            else{
                return true;
            }
        })
    };

    const passPhrase = {'RandomPass' : crypto.randomBytes(10).toString('hex') + 
                                       crypto.randomBytes(10).toString('hex').toUpperCase()
                    };

    let createPublicPrivateKeyPair = function(){
        return new Promise((resolve, reject)=>{
            crypto2.createKeyPair().then(
                result =>{
                    privateKey = result.privateKey;
                    publicKey = result.publicKey;
                    createFile(publicFileName, publicKey);
                    createFile(privateFileName, privateKey);
                    if(privateKey.length > 5 && publicKey.length > 5){
                        resolve({'publickey':publicKey, 'privatekey':privateKey})
                    }
                        
                    else{
                        reject({'error':'unable to generate keys'})
                    }
                }
            )
        })
    };

    let loadKeys = function(){
        return new Promise((resolve,reject)=>{
            if(publicKey.length < 1 || privateKey.length < 1){
                crypto2.readPublicKey(publicFileName).then(
                    result => {publicKey = result;
                }).catch((error)=>{reject("usr_error | public key not found error at loadkeys")});
                crypto2.readPrivateKey(privateFileName).then(
                    result=>{privateKey = result;
                    if(privateKey.length > 1 && publicKey.length > 1)
                        resolve({'publickey':publicKey, 'privatekey':privateKey})
                    else
                        reject({'error':'public key or private key not found'})
                }).catch((error)=>{reject("usr_error | private key not found error at loadkeys")});;
            }
        });
    }

    let isKeyPairGenerated = function(fle1 = publicFileName, fle2 = privateFileName){
        return new Promise((resolve,reject)=>{
            fs.stat(fle1,(err,stats)=>{
                        if(err){
                            reject({'error':'public key missing'})
                        }else{
                            fs.stat(fle2, (err, stats)=>{
                                if(err){
                                    reject({'error':'private key missing'})
                                }else{
                                    resolve({'status':'keysfound'})
                                }
                            })
                        }
                        
                    }
                )
        });
    }

    let encrypt_RSA_StringJson = function(pub, encObj = passPhrase){
        let promises = [];
        for(let x in encObj){
            promises.push(
                new Promise((resolve,reject)=>{
                    if(encObj[x].length > 0){
                        crypto2.encrypt.rsa(encObj[x], pub).then(
                            result=>{
                                let rs = {[x] : result}
                                resolve(rs);
                            },
                            reject=>{
                                let rs = {[x] : 'usr_encryption_failed:' + reject}
                                reject(rs)
                            }
                        )
                    }
                })
            )
        }
        return Promise.all(promises)
    }

    let decrypt_RSA_StringJson = function(pri, encObj){
        let promises = [];
        for(let x in encObj){
            promises.push(
                new Promise((resolve,reject)=>{
                    if(encObj[x].length > 0){
                        crypto2.decrypt.rsa(encObj[x], pri).then(
                            result=>{
                                let rs = {[x] : result}
                                resolve(rs);
                            },
                            reject=>{
                                let rs = {[x] : 'usr_decryption_failed:' + reject}
                                reject(rs)
                            }
                        )
                    }
                })
            )
        }
        return Promise.all(promises)
    }

    let readFile = function(filePath){
        return new Promise((resolve, reject)=>{
            resolve(fs.readFileSync(filePath, 'utf8'))
            reject('file not found')
        }) 
    }

    let createRandomEncrypterCipher = function(cipherFilePath){
        
        return new Promise((p_resolve, p_reject)=>{
            isKeyPairGenerated().then(result => {
                return loadKeys().then(result=>result, reject=>reject)
            }
                    , reject=>{
                    return createPublicPrivateKeyPair().then(result => result, reject => reject)
            })
            .then(function(result){
                    let x = encrypt_RSA_StringJson(result.publickey)
                        .then(result => result.forEach((item)=>{
                        createFile(cipherFilePath, item.RandomPass);
            })
                , reject => console.log('usr_error | while creating the random key | createRandomEncrypterCipher ' + reject))
            })
        })
    }
    
    let getPlainText = function(filePath){
        
        return new Promise((resolve, Mreject)=>{
            loadKeys()
            .then(result=>{return result}, reject=>{
                console.log("\n" + reject)
                return reject
            }).catch((error)=> {console.log('usr_error | created at | getPlainText ' + error)})
            .then(function(keyresult) {
                
                return readFile(filePath).then(result => {
                    
                    let inputJson2Decrypt = {'enc':result}
                    decrypt_RSA_StringJson( keyresult.privatekey, inputJson2Decrypt)
                            .then(result => resolve(result), reject=> Mreject(reject))
                            .catch((error)=> {console.log('usr_error | created at | getPlainText ' + error)})
                }
                ,reject=>{
                    
                    console.log('usr_error | cipher file not found at | getPlainText ' + reject);
                    Mreject('rejected since no cipher file exists');
                }).catch((error)=> {console.log('usr_error | created at | getPlainText ' + error)})
            }).catch((error)=>{console.log("usr_error | occured at | getPlainText " + error)})
        })
    } 
    
    let fetchKey = function(){
        
        return new Promise((resolve, reject)=>{
            
            getPlainText(cipherFileLocation).then(result=>{
                result.forEach((item)=>{
                    resolve(item.enc);
                }),
                reject=>{
                    console.log("usr_error | Cipher key read error inside reject| createCipherKey " + reject);
                    reject('');
                    createRandomEncrypterCipher(cipherFileLocation).then(result =>{
                        getPlainText(cipherFileLocation).then(result=>{
                            result.forEach((item)=>{
                                resolve(item.enc);
                            }),
                            reject=>{ console.log("cipher key generation failed at | createCipherKey " + reject)}
                        })
                    })
                }
            }).catch((error)=>{
                console.log("usr_error | cipher key read error inside catch| createCipherKey");
                createRandomEncrypterCipher(cipherFileLocation).then(result =>{
                    getPlainText(cipherFileLocation).then(result=>{
                        result.forEach((item)=>{
                            resolve(item.enc);
                        }),
                        reject=>{ console.log("cipher key generation failed at | createCipherKey " + reject)}
                    })
                })
            }) 
        })
    }
    let createCipherKey = function(){
        
        return new Promise((resolve, reject)=>{
            fetchKey().then(key=>{
                
                let cipher = crypto.createCipher('aes192', key)
                resolve(cipher);
            }, error=>{
                console.log("error creating cipher key");
                reject('');
            })
        })
    }

    let createDecipherKey = function(){
        return new Promise((resolve, reject)=>{
            fetchKey().then(key=>{
                
                let decipher = crypto.createDecipher('aes192',key)
                resolve(decipher);
            }, error=>{
                console.log("error creating decipher key");
                reject('');
            })
        })
    }

    let encryptStream = function(in_json){
            createCipherKey().then(cipher => {
                let input = in_json.input;
                input = (input === 'stream')?process.stdin:fs.createReadStream(input);
                let output = in_json.output;
                output = (output === 'stream')?process.stdout:fs.createWriteStream(output);
                input.pipe(cipher).pipe(output)
            })
    }

    let decryptStream = function(in_json){
        debugger
        createDecipherKey().then(decipher => {
            let input = in_json.input;
            input = (input === 'stream')?process.stdin:fs.createReadStream(input);
            let output = in_json.output;
            output = (output === 'stream')?process.stdout:fs.createWriteStream(output); 
            input.pipe(decipher).pipe(output)          
        })
    }

    this.processInputString = function(input){
        if(input._[0] == 'encrypt' || input._[0] == 'decrypt'){
            let inputFileLocation = '';
            let outputFileLocation = '';
            let cryptingParam = {}
            if(input.i && typeof(input.i)==='string'){
                inputFileLocation = input.i
            }
            if(input.o && typeof(input.o)==='string'){
                outputFileLocation = input.o
    
            }
    
            if(input._[0] == 'encrypt'){
                cryptingParam.method = 'encrypt';
                cryptingParam.input = inputFileLocation.length>0?inputFileLocation:'stream';
                cryptingParam.output = outputFileLocation.length>0?outputFileLocation:'stream';
                encryptStream(cryptingParam)

            }else if(input._[0] == 'decrypt'){
                cryptingParam.method = 'decrypt';
                cryptingParam.input = inputFileLocation.length>0?inputFileLocation:'stream';
                cryptingParam.output = outputFileLocation.length>0?outputFileLocation:'stream';
                decryptStream(cryptingParam)
            }
            
        }else{
            console.log("\nusage: encrypt|decrypt [-i <path>] [-o <path>]");
            console.log("\n-i   input, skip if its from command line");
            console.log("\n-o   outpu, skip if its read from command line");
        }
    }
}

let cryp = new CryptoStr()

cryp.processInputString(argv)