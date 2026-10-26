
from Crypto.Cipher import DES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# Generate an 8-byte DES key
key = get_random_bytes(8)

# Input message
message = input("Enter plaintext: ").encode()

# Encryption
cipher = DES.new(key, DES.MODE_CBC)
ciphertext = cipher.encrypt(pad(message, DES.block_size))

print("Encrypted text:", ciphertext.hex())

# Decryption
decipher = DES.new(key, DES.MODE_CBC, iv=cipher.iv)
plaintext = unpad(decipher.decrypt(ciphertext), DES.block_size)

print("Decrypted text:", plaintext.decode())
