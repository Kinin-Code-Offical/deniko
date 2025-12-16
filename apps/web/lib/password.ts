import * as argon2 from "argon2";

/**
 * Hashes a password using argon2.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

/**
 * Verifies a password against a hash.
 * @param password The plain text password.
 * @param hash The hashed password.
 * @returns True if the password matches the hash, false otherwise.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}
