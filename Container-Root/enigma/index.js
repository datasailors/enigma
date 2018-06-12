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
    let cipherFileLocation = path + 'Ciphered.PWD'


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
                    //privateKey = "";
                    if(privateKey.length > 5 && publicKey.length > 5){
                        resolve({'publickey':publicKey, 'privatekey':privateKey})
                    }
                    else{
                        throw new Error("Failed at generating the public and private key\n");
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
                }).catch((error) => {throw new Error("failed at loading keys")})
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

    let encrypt_RSA_StringJson = function(pub, encObj){
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
                        ).catch((err)=>{
                            throw new Error("Failed while encrypting password");
                        })
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
                        debugger
                        crypto2.decrypt.rsa(encObj[x], pri).then(
                            result=>{
                                let rs = {[x] : result}
                                resolve(rs);
                            },
                            reject=>{
                                let rs = {[x] : 'usr_decryption_failed:' + reject}
                                reject(rs)
                            }
                        ).catch((err)=>{
                            throw new Error("Filed while decrypting password")
                        })
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
    //Creates a Random Password, Stores it in the PWD file (encrypted).
    //This is called usually when application is called for the first time or cipher password is deleted.
    //If RSA key pairs do not exist (called for the first time) they are generated as well.
    let createRandomEncrypterCipher = function(cipherFilePath){
        return new Promise((p_resolve, p_reject)=>{
            isKeyPairGenerated()
                .then(result => {
                return loadKeys().then(result => result, reject => reject)
                }
                ,reject=>{
                    return createPublicPrivateKeyPair().then(result => result, reject => reject)
                })
            .then(function(result){
                getRandomPass().then(pass => {
                    createFile(cipherFilePath, pass.RandomPass);
                    encrypt_RSA_StringJson(result.publickey, pass)
                    .then(result => result.forEach((item)=>{
                        createFile(cipherFilePath, item.RandomPass);
                        p_resolve(pass.RandomPass);
                    })
                    , reject => console.log('usr_error | while creating the random key | createRandomEncrypterCipher ' + reject))
                });
            }).catch(err => p_reject(err));
        })
    }
    
    let getRandomPass = function(){
        return new Promise((resolve, reject) =>{
            resolve(passPhrase), reject()
        });
    }

    let decryptCipherPass = function(filePath){ // returns [ { enc: '69d8a11baf2e563d9e8d0E1437BF6D459EB1BD1C' } ]
        return new Promise((resolve, Mreject)=>{
            loadKeys()
            .then(result => result , reject=>{
                console.log("\n" + reject)
                return reject
                //This happens if the key pairs are deleted or failed to load. terminate the process. implement the key pair generation in the next release.
            }).catch((error)=> {console.log('usr_error | created at | decryptCipherPass ' + error)})
            .then(function(keyresult) {
                debugger
                readFile(filePath).then(result => {
                    let inputJson2Decrypt = {'enc':result}
                    decrypt_RSA_StringJson( keyresult.privatekey, inputJson2Decrypt)
                            .then(result => resolve(result), reject=> Mreject(reject))
                            .catch((error)=> {console.log('usr_error | created at | decryptCipherPass ' + error)})
                }
                //The code should not reach here. This situation should be prevented prior to this method call.
            //     ,reject=>{
            //         debugger
            //         console.log('usr_error | cipher file not found at | decryptCipherPass ' + reject);
            //         Mreject('rejected since no cipher file exists');
            //     }).catch((error)=> {console.log('usr_error | created at | decryptCipherPass ' + error)})
            // }).catch((error)=>{console.log("usr_error | occured at | decryptCipherPass " + error)}
            )
        })
    }
    )}
    
    let loadCipherPass = function(){
        return new Promise((resolve, reject)=>{
            //check if the file exists first. else, create the file and return a new password.
            if(fs.existsSync(cipherFileLocation)){
                decryptCipherPass(cipherFileLocation).then(result=>{
                    result.forEach((item)=>{
                        resolve(item.enc);
                    })
                    //,
                    // reject=>{
                    //     console.log("usr_error | Cipher key read error inside reject| createCipherKey " + reject);
                    //     reject('');
                    //     createRandomEncrypterCipher(cipherFileLocation).then(result =>{
                    //         decryptCipherPass(cipherFileLocation).then(result=>{
                    //             result.forEach((item)=>{
                    //                 resolve(item.enc);
                    //             }),
                    //             reject=>{ console.log("cipher key generation failed at | createCipherKey " + reject)}
                    //         })
                    //     })
                    // }
                }).catch((err) => {
                    console.log(err);
                    throw new Error("Error while calling the decryptCipherPass from loadCipherPass")})
                // .catch((error)=>{
                //     console.log("usr_error | cipher key read error inside catch| createCipherKey");
                //     createRandomEncrypterCipher(cipherFileLocation).then(result =>{
                //         decryptCipherPass(cipherFileLocation).then(result=>{
                //             result.forEach((item)=>{
                //                 resolve(item.enc);
                //             }),
                //             reject=>{ console.log("cipher key generation failed at | createCipherKey " + reject)}
                //         })
                //     })
                // })
            }else{
                createRandomEncrypterCipher(cipherFileLocation)
                .then(plainPass => {resolve(plainPass)})
                .catch(err => {
                    console.log(err)
                    throw new Error("could not load the password as plain text inside loadCipherPass")
                })
            }
        })
    }

    let createCipherKey = function(){
        return new Promise((resolve, reject)=>{
            loadCipherPass().then(key=>{
                let cipher = crypto.createCipher('aes192', key)
                resolve(cipher);
            }, error=>{
                console.log("error creating cipher key");
                reject(error);
            })
        })
    }

    let createDecipherKey = function(){
        return new Promise((resolve, reject)=>{
            loadCipherPass().then(key=>{
                let decipher = crypto.createDecipher('aes192',key)
                resolve(decipher);
            }, error=>{
                console.log("error creating decipher key");
                reject(error);
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
        createDecipherKey().then(decipher => {
            let input = in_json.input;
            input = (input === 'stream')?process.stdin:fs.createReadStream(input);
            let output = in_json.output;
            output = (output === 'stream')?process.stdout:fs.createWriteStream(output); 
            input.pipe(decipher).pipe(output)          
        }).catch((err) => {console.log("kir"); throw new Error("kir")})
    }

    this.processInputString = function(input){
        console.log(input)
        if (input._[0] == 'encrypt' || input._[0] == 'decrypt'){
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
