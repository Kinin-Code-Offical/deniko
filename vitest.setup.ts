import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('server-only', () => {
  return {}
})

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/testdb';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'password';
process.env.GCS_BUCKET_NAME = 'test-bucket';
process.env.GCS_PROJECT_ID = 'test-project';
process.env.GCS_CLIENT_EMAIL = 'test@example.com';
process.env.GCS_PRIVATE_KEY = 'private-key';
process.env.AUTH_SECRET = 'secret';
process.env.AUTH_GOOGLE_ID = 'google-id';
process.env.AUTH_GOOGLE_SECRET = 'google-secret';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
