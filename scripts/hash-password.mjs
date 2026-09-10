#!/usr/bin/env node
/**
 * Generates the value of ADMIN_PASSWORD_HASH.
 *
 *   npm run admin:hash -- 'my-password'
 *
 * The password itself is never stored: only the scrypt hash is.
 */
import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run admin:hash -- 'your-password'");
  process.exit(1);
}

if (password.length < 10) {
  console.error('Choose a password of at least 10 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const derived = scryptSync(password, salt, 64);

console.log('\nAdd these lines to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${derived.toString('hex')}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString('hex')}\n`);
