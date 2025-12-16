# onboarding.ts

**Path**: `apps\web\app\actions\onboarding.ts`

## completeOnboarding

**Type**: `FunctionDeclaration`

Completes the onboarding process for a user.
Updates the user's role, phone number, password, and creates the corresponding profile.

```typescript
export async function completeOnboarding(data:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| data | `{ role: "TEACHER" | "STUDENT"; phoneNumber: string; password?: string; confirmPassword?: string; terms?: boolean; marketingConsent?: boolean; preferredTimezone?: string; preferredCountry?: string; }` | true |

