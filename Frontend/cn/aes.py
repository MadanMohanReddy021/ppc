
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# Generate a 16-byte secret key
key = get_random_bytes(16)

# Input message
message = input("Enter plaintext: ").encode()

# Encryption
cipher = AES.new(key, AES.MODE_CBC)
ciphertext = cipher.encrypt(pad(message, AES.block_size))

print("Encrypted text:", ciphertext.hex())

# Decryption
decipher = AES.new(key, AES.MODE_CBC, iv=cipher.iv)
plaintext = unpad(decipher.decrypt(ciphertext), AES.block_size)

print("Decrypted text:", plaintext.decode())
