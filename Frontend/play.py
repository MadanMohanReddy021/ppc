def create_matrix(key):
    key = key.upper().replace("J", "I")

    # Remove duplicate letters
    key_unique = ""
    for ch in key:
        if ch.isalpha() and ch not in key_unique:
            key_unique += ch

    # Add remaining alphabet letters
    alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
    for ch in alphabet:
        if ch not in key_unique:
            key_unique += ch

    # Create 5x5 matrix
    matrix = [key_unique[i:i + 5] for i in range(0, 25, 5)]

    return matrix


def find_position(matrix, letter):
    for row in range(5):
        for col in range(5):
            if matrix[row][col] == letter:
                return row, col


def prepare_text(text):
    text = text.upper().replace("J", "I")
    text = "".join(ch for ch in text if ch.isalpha())

    result = ""
    i = 0

    while i < len(text):
        a = text[i]

        if i + 1 < len(text):
            b = text[i + 1]

            if a == b:
                result += a + "X"
                i += 1
            else:
                result += a + b
                i += 2
        else:
            result += a + "X"
            i += 1

    return result


def encrypt(plaintext, matrix):
    plaintext = prepare_text(plaintext)
    ciphertext = ""

    for i in range(0, len(plaintext), 2):
        a = plaintext[i]
        b = plaintext[i + 1]

        r1, c1 = find_position(matrix, a)
        r2, c2 = find_position(matrix, b)

        # Same row
        if r1 == r2:
            ciphertext += matrix[r1][(c1 + 1) % 5]
            ciphertext += matrix[r2][(c2 + 1) % 5]

        # Same column
        elif c1 == c2:
            ciphertext += matrix[(r1 + 1) % 5][c1]
            ciphertext += matrix[(r2 + 1) % 5][c2]

        # Rectangle
        else:
            ciphertext += matrix[r1][c2]
            ciphertext += matrix[r2][c1]

    return ciphertext


def decrypt(ciphertext, matrix):
    plaintext = ""

    for i in range(0, len(ciphertext), 2):
        a = ciphertext[i]
        b = ciphertext[i + 1]

        r1, c1 = find_position(matrix, a)
        r2, c2 = find_position(matrix, b)

        # Same row
        if r1 == r2:
            plaintext += matrix[r1][(c1 - 1) % 5]
            plaintext += matrix[r2][(c2 - 1) % 5]

        # Same column
        elif c1 == c2:
            plaintext += matrix[(r1 - 1) % 5][c1]
            plaintext += matrix[(r2 - 1) % 5][c2]

        # Rectangle
        else:
            plaintext += matrix[r1][c2]
            plaintext += matrix[r2][c1]

    return plaintext


# Main program
key = input("Enter key: ")
plaintext = input("Enter plaintext: ")

matrix = create_matrix(key)

print("\nPlayfair Matrix:")
for row in matrix:
    print(" ".join(row))

ciphertext = encrypt(plaintext, matrix)

print("\nCiphertext:", ciphertext)

decrypted = decrypt(ciphertext, matrix)

print("Decrypted:", decrypted)