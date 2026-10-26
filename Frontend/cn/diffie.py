
# Diffie-Hellman Key Exchange

# Step 1: Public values
P = 23       # Prime number
G = 5        # Primitive root

# Step 2: Private keys of Alice and Bob
a = 6        # Alice's private key
b = 15       # Bob's private key

# Step 3: Calculate public keys
A = pow(G, a, P)
B = pow(G, b, P)

print("Alice's public key:", A)
print("Bob's public key:", B)

# Step 4: Calculate shared secret key
key_Alice = pow(B, a, P)
key_Bob = pow(A, b, P)

print("Alice's shared key:", key_Alice)
print("Bob's shared key:", key_Bob)

# Step 5: Verify shared key
if key_Alice == key_Bob:
    print("Key exchange successful!")
else:
    print("Key exchange failed!")
