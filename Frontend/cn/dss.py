
# DSS (Digital Signature Standard) using DSA

from cryptography.hazmat.primitives.asymmetric import dsa
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature

# Step 1: Generate private and public keys
private_key = dsa.generate_private_key(key_size=2048)
public_key = private_key.public_key()

# Step 2: Message to be signed
message = b"Hello, this is DSS"

# Step 3: Generate digital signature
signature = private_key.sign(
    message,
    hashes.SHA256()
)

print("Digital Signature generated successfully!")

# Step 4: Verify the signature
try:
    public_key.verify(
        signature,
        message,
        hashes.SHA256()
    )
    print("Signature is valid!")
except InvalidSignature:
    print("Signature is invalid!")

# Step 5: Test with a modified message
modified_message = b"Hello, this is modified"

try:
    public_key.verify(
        signature,
        modified_message,
        hashes.SHA256()
    )
    print("Signature is valid!")
except InvalidSignature:
    print("Modified message: Signature is invalid!")
