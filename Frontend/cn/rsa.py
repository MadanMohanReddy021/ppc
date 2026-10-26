
# RSA Encryption and Decryption

# Step 1: Choose two prime numbers
p = 3
q = 11

# Step 2: Calculate n
n = p * q

# Step 3: Calculate Euler's totient
phi = (p - 1) * (q - 1)

# Step 4: Choose public key e
e = 3

# Step 5: Calculate private key d
d = pow(e, -1, phi)

# Step 6: Read the message
message = int(input("Enter a number to encrypt (less than n): "))

# Step 7: Encryption
ciphertext = pow(message, e, n)
print("Encrypted message:", ciphertext)

# Step 8: Decryption
decrypted = pow(ciphertext, d, n)
print("Decrypted message:", decrypted)
