def encrypt(plaintext, key):
    plaintext = plaintext.upper()
    key = key.upper()

    ciphertext = ""
    key_index = 0

    for ch in plaintext:
        if ch.isalpha():
            p = ord(ch) - ord('A')
            k = ord(key[key_index % len(key)]) - ord('A')

            c = (p + k) % 26

            ciphertext += chr(c + ord('A'))

            key_index += 1
        else:
            ciphertext += ch

    return ciphertext


def decrypt(ciphertext, key):
    ciphertext = ciphertext.upper()
    key = key.upper()

    plaintext = ""
    key_index = 0

    for ch in ciphertext:
        if ch.isalpha():
            c = ord(ch) - ord('A')
            k = ord(key[key_index % len(key)]) - ord('A')

            p = (c - k) % 26

            plaintext += chr(p + ord('A'))

            key_index += 1
        else:
            plaintext += ch

    return plaintext


# Main
plaintext = input("Enter plaintext: ")
key = input("Enter key: ")

ciphertext = encrypt(plaintext, key)

print("Ciphertext:", ciphertext)
print("Decrypted:", decrypt(ciphertext, key))