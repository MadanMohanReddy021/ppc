
# RC4 Encryption and Decryption

def rc4(key, message):
    # Step 1: Initialize the state array
    S = list(range(256))
    j = 0

    # Step 2: Key Scheduling Algorithm (KSA)
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]

    # Step 3: Pseudo-Random Generation Algorithm (PRGA)
    i = j = 0
    result = []

    for char in message:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]

        # Generate keystream byte
        k = S[(S[i] + S[j]) % 256]

        # XOR with message byte
        result.append(char ^ k)

    return bytes(result)


# Input
key = input("Enter key: ").encode()
plaintext = input("Enter plaintext: ").encode()

# Encryption
ciphertext = rc4(key, plaintext)
print("Encrypted (hex):", ciphertext.hex())

# Decryption
decrypted = rc4(key, ciphertext)
print("Decrypted text:", decrypted.decode())
