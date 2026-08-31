def encrypt(plaintext, key):
    plaintext = plaintext.replace(" ", "").upper()

    columns = len(key)
    rows = (len(plaintext) + columns - 1) // columns

    # Add X as padding
    plaintext += "X" * (rows * columns - len(plaintext))

    # Create matrix
    matrix = []

    for i in range(rows):
        row = []
        for j in range(columns):
            row.append(plaintext[i * columns + j])
        matrix.append(row)

    # Get column order
    order = sorted(range(columns), key=lambda x: (key[x], x))

    # Read columns according to key order
    ciphertext = ""

    for col in order:
        for row in range(rows):
            ciphertext += matrix[row][col]

    return ciphertext


def decrypt(ciphertext, key):
    columns = len(key)
    rows = len(ciphertext) // columns

    # Get column order
    order = sorted(range(columns), key=lambda x: (key[x], x))

    # Empty matrix
    matrix = [[""] * columns for _ in range(rows)]

    index = 0

    # Fill columns according to key order
    for col in order:
        for row in range(rows):
            matrix[row][col] = ciphertext[index]
            index += 1

    # Read row-wise
    plaintext = ""

    for row in range(rows):
        for col in range(columns):
            plaintext += matrix[row][col]

    return plaintext.rstrip("X")


# Main
plaintext = input("Enter plaintext: ")
key = input("Enter key: ")

ciphertext = encrypt(plaintext, key)

print("Ciphertext:", ciphertext)
print("Decrypted:", decrypt(ciphertext, key))