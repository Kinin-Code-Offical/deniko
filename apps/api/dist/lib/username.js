"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueUsername = generateUniqueUsername;
const db_1 = require("../db");
async function generateUniqueUsername(firstName, lastName) {
    const normalize = (value) => {
        return value
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "") // remove diacritics
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
    };
    const base = normalize(firstName) + normalize(lastName) ||
        normalize(firstName) ||
        "user";
    let candidate = base;
    let suffix = 1;
    // Loop until a free username is found
    while (true) {
        const exists = await db_1.db.user.findUnique({ where: { username: candidate } });
        if (!exists) {
            return candidate;
        }
        suffix += 1;
        candidate = `${base}${suffix}`;
    }
}
