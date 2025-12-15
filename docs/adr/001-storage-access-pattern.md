# ADR 001: Storage Access Pattern

## Status

Accepted

## Context

We need to store user-generated content (avatars, course materials) securely.

- Files should not be publicly guessable.
- Access control must be enforced by the application logic (RBAC, Privacy Settings).
- We use Google Cloud Storage (GCS) as the backend.

## Decision

We will use a **Private Bucket + Signed URLs** pattern.

1. **Bucket Configuration**: The GCS bucket will have "Public Access Prevention" enabled. No file is public by default.
2. **Upload**: Performed via Server Actions. The server validates the file and streams it to GCS using the Service Account credentials.
3. **Read Access**:
    - The client requests a URL for a file.
    - The server verifies the user's permission to view that file (checking `UserSettings`, `Role`, etc.).
    - If authorized, the server generates a **Signed URL** (V4) with a short expiration (e.g., 5 minutes).
    - The client uses this temporary URL to fetch the content directly from GCS.

## Consequences

### Positive

- **Security**: GCS handles the heavy lifting of serving files, but our app controls *who* gets the key.
- **Performance**: Signed URLs allow direct downloads from GCS edge locations, bypassing our application server for the data transfer.

### Negative

- **Complexity**: Requires an extra round-trip to the server to get the URL before fetching the image.
- **Caching**: Signed URLs are unique per generation time, making browser caching slightly more complex (requires careful `Cache-Control` headers on the GCS object).

## References

- [GCS Signed URLs Documentation](https://cloud.google.com/storage/docs/access-control/signed-urls)
