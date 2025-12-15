# ADR 002: Privacy Enforcement

## Status

Accepted

## Context

Users have privacy settings (e.g., `profileVisibility`, `showEmail`). We must ensure that these settings are respected across the entire application, including API routes, Server Components, and Search results.

## Decision

We will enforce privacy at the **Data Access Layer** (or as close to it as possible), not just in the UI.

1. **Database Schema**: `UserSettings` table stores preferences.
2. **Retrieval Logic**:
    - When fetching a user profile for a public view, we must *always* join `UserSettings`.
    - A utility function (or service method) `getPublicProfile(username)` will handle the logic:

        ```typescript
        if (user.settings.profileVisibility === 'private') {
            return null; // Or 404
        }
        // Filter fields based on settings
        return {
            email: user.settings.showEmail ? user.email : null,
            ...
        }
        ```

3. **API Routes**: Endpoints like `/api/avatar/[userId]` must perform this check before serving content.

## Consequences

### Positive

- **Consistency**: Privacy rules are applied uniformly.
- **Safety**: Reduces the risk of accidentally exposing private data in a new UI component.

### Negative

- **Performance**: Requires fetching `UserSettings` with every user query. (Mitigated by database indexing and potentially caching).

## References

- [OWASP Privacy by Design](https://owasp.org/www-project-top-10/2017/A3_2017-Sensitive_Data_Exposure)
