# Enigma
Enigma is an open source asymmetric encryption application which allows us to encrypt and decrypt content using a public and private key.

# Dependencies
You would need to install Docker for this project.

# How to use
Just run the following command for Encryption :


```sh
version 1.0:
docker run -it --rm -v ~/keys:/keys bhgedigital/enigma:1.0 encrypt [Plain Text]

version 2.0:
docker run -it --rm -v ~/keys:/keys -v $(pwd):/wd bhgedigital/enigma:2.0 encrypt -i <plain_file> -o <encrypted_file>

or

./encrypt.sh -i <plain_file> -o <encrypted_file>
```


and for Decrypting :

```sh
version 1.0
docker run -it --rm -v ~/keys:/keys bhgedigital/enigma:1.0 decrypt [Encrypted Text]

version 2.0
docker run -it --rm -v ~/keys:keys  -v $(pwd):/wd bhgedigital/enigma:2.0 decrypt -i <encrypted_file> -o <decrypted_file>

or

./decrypt.sh -i <encrypted_file> -o <dependent_file>
```


# Whats happening behind the scene . . .

Application will create both encryption keys in the container and share it (with running host machine) at the host ~/keys folder for the first run. tampering with these files will cause the application to fail to behave correctly. if these files are deleted from the host (running machine), the encrypted text will fail to decrypt correctly since a new pair will be generated upone any of the missing keys.

# References:
The Docker image for this project is located here:
https://github.com/bhgedigital/enigma.git

