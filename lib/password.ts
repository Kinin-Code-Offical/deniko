import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcryptjs.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a hash.
 * @param password The plain text password.
 * @param hash The hashed password.
 * @returns True if the password matches the hash, false otherwise.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
