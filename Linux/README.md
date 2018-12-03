# Enigma
Enigma is an open source asymmetric encryption application which allows the user to encrypt and decrypt content using a public and private key.

# Dependencies
You only need to install Docker to compile and run this project.

# How to use
Just run the following command for Encryption :


```sh
docker run -it --rm -v ~/keys:/keys -v $(pwd):/wd bhgedigital/enigma:2.0 encrypt -i <plain_file> -o <encrypted_file>

or

docker run -it --rm -v ~/keys:/keys -v $(pwd):/wd bhgedigital/enigma:2.0 encrypt "Plain text here"

or

./encrypt.sh -i <plain_file> -o <encrypted_file>

or

./encrypt.sh "Plain text here"
```


and for Decrypting :

```sh
docker run -it --rm -v ~/keys:keys  -v $(pwd):/wd bhgedigital/enigma:2.0 decrypt -i <encrypted_file> -o <decrypted_file>

or

docker run -it --rm -v ~/keys:keys  -v $(pwd):/wd bhgedigital/enigma:2.0 decrypt "Encrypted text here"

or

./decrypt.sh "Encrypted text here"
```

Note: The path to the encrypted and decrypted file is the path within the container. Check setting VOL_MAP in your .env file for more details. 

# Whats happening behind the scenes . . .

If you do not have a key-pair, the application will create it in the container and store it on the host in the ~/keys folder. If the keys are lost, the application will no longer be able to decrypt the content. If the keys are shared with someone else, they will be able to decrypt the content as well. The public key is required for encrypting and the private key is required for decrypting of content.

# References:
The Docker image for this project is located here:
https://github.com/bhgedigital/enigma.git

