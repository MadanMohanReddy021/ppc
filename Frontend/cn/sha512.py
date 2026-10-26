
import hashlib

text = input("Enter the message: ")

hash_value = hashlib.sha512(text.encode()).hexdigest()

print("Original Message:", text)
print("SHA-512 Hash:", hash_value)
