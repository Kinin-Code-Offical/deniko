# student.ts

**Path**: `app\actions\student.ts`

## createStudent

**Type**: `FunctionDeclaration`

Creates a new "Shadow Student" profile.
This profile is not yet linked to a real user account.

```typescript
export async function createStudent(formData: FormData)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| formData | `FormData` | true |

## claimStudentProfile

**Type**: `FunctionDeclaration`

Claims a student profile using an invitation token.
Merges the shadow profile with the authenticated user's profile if needed.

```typescript
export async function claimStudentProfile(
  token: string,
  preferences: MergePreferences
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| preferences | `MergePreferences` | true |

## getInviteDetails

**Type**: `FunctionDeclaration`

Retrieves a student profile by its invitation token.

```typescript
export async function getInviteDetails(token: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |

## getStudentProfileByToken

**Type**: `FunctionDeclaration`

```typescript
export async function getStudentProfileByToken(token: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |

## updateStudent

**Type**: `FunctionDeclaration`

Updates a student's information.
Handles both Shadow and Claimed profiles differently.

```typescript
export async function updateStudent(data: z.infer<typeof updateStudentSchema>)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| data | `{ studentId: string; firstName: string; lastName: string; phone?: string | undefined; avatarUrl?: string | undefined; }` | true |

## unlinkStudent

**Type**: `FunctionDeclaration`

Archives a student relation (soft delete).

```typescript
export async function unlinkStudent(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## deleteStudent

**Type**: `FunctionDeclaration`

Deletes a student or relation.
If the student is a shadow student created by the teacher, the profile is deleted.
Otherwise, only the relation is deleted.

```typescript
export async function deleteStudent(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## updateStudentRelation

**Type**: `FunctionDeclaration`

Updates the relation details between a teacher and a student.

```typescript
export async function updateStudentRelation(
  studentId: string,
  data: UpdateStudentRelationData
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |
| data | `UpdateStudentRelationData` | true |

## deleteShadowStudent

**Type**: `FunctionDeclaration`

Deletes a shadow student profile.

```typescript
export async function deleteShadowStudent(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## regenerateInviteToken

**Type**: `FunctionDeclaration`

```typescript
export async function regenerateInviteToken(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## toggleInviteLink

**Type**: `FunctionDeclaration`

```typescript
export async function toggleInviteLink(studentId: string, enable: boolean)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |
| enable | `boolean` | true |

## updateStudentSettings

**Type**: `FunctionDeclaration`

```typescript
export async function updateStudentSettings(
  studentId: string,
  formData: FormData
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |
| formData | `FormData` | true |
