# Enigma
Enigma is an open source asymmetric encryption algorithm application which allows us to encrypt and dycrypt any string using a public key and private key.

# Dependencies
You would need to install Docker for this project.

# How to use
Just run the following command for Encryption :

docker container run -e http_proxy= -e https_proxy= -e no_proxy=localhost --name enigma -it -v ~/keys:/keys --rm iankoulski/enigma:latest node /enigma/index.js encrypt [Plain Text]


and for Decrypting :

docker container run -e http_proxy= -e https_proxy= -e no_proxy=localhost --name enigma -it -v ~/keys:/keys --rm iankoulski/enigma:latest node /enigma/index.js decrypt [Encrypted Text]

# Whats happening behind the scene . . .

