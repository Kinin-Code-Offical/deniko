# account-deletion.ts

**Path**: `lib\account-deletion.ts`

## deleteUserAndRelatedData

**Type**: `FunctionDeclaration`

Deletes a user and all related data based on their role and relationships.
Handles shadow students, teacher profiles, and anonymization.

```typescript
export async function deleteUserAndRelatedData(userId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| userId | `string` | true |

