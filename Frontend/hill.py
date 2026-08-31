import numpy as np

# Convert letter to number
def char_to_num(c):
    return ord(c) - ord('A')


# Convert number to letter
def num_to_char(n):
    return chr((n % 26) + ord('A'))


# Find modular inverse
def mod_inverse(a, m):
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None


# Encrypt
def encrypt(plaintext, key):
    plaintext = plaintext.upper().replace(" ", "")

    # Add X if length is odd
    if len(plaintext) % 2 != 0:
        plaintext += "X"

    ciphertext = ""

    for i in range(0, len(plaintext), 2):

        # Convert pair into numbers
        vector = np.array([
            char_to_num(plaintext[i]),
            char_to_num(plaintext[i + 1])
        ])

        # Matrix multiplication
        result = np.dot(key, vector) % 26

        ciphertext += num_to_char(result[0])
        ciphertext += num_to_char(result[1])

    return ciphertext


# Decrypt
def decrypt(ciphertext, key):

    # Determinant
    det = int(round(np.linalg.det(key))) % 26

    # Modular inverse of determinant
    det_inv = mod_inverse(det, 26)

    if det_inv is None:
        return "Key matrix cannot be inverted modulo 26"

    # Inverse of 2x2 matrix
    inverse_key = np.array([
        [key[1][1], -key[0][1]],
        [-key[1][0], key[0][0]]
    ])

    inverse_key = (det_inv * inverse_key) % 26

    plaintext = ""

    for i in range(0, len(ciphertext), 2):

        vector = np.array([
            char_to_num(ciphertext[i]),
            char_to_num(ciphertext[i + 1])
        ])

        result = np.dot(inverse_key, vector) % 26

        plaintext += num_to_char(result[0])
        plaintext += num_to_char(result[1])

    return plaintext


# Main program

key = np.array([
    [3, 3],
    [2, 5]
])

plaintext = input("Enter plaintext: ")

ciphertext = encrypt(plaintext, key)

print("Ciphertext:", ciphertext)

decrypted = decrypt(ciphertext, key)

print("Decrypted:", decrypted)