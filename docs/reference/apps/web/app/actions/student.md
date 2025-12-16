# student.ts

**Path**: `apps\web\app\actions\student.ts`

## createStudent

**Type**: `FunctionDeclaration`

```typescript
export async function createStudent(formData: FormData)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| formData | `FormData` | true |

## claimStudentProfile

**Type**: `FunctionDeclaration`

```typescript
export async function claimStudentProfile(token: string, preferences: Record<string, unknown>)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| preferences | `Record<string, unknown>` | true |

## getInviteDetails

**Type**: `FunctionDeclaration`

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

```typescript
export async function updateStudent(data: z.infer<typeof updateStudentSchema> &
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| data | `{ studentId?: string; name?: string; surname?: string; studentNo?: string; grade?: string; tempPhone?: string; tempEmail?: string; } & { avatar?: File; selectedAvatar?: string; }` | true |

## unlinkStudent

**Type**: `FunctionDeclaration`

```typescript
export async function unlinkStudent(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## deleteStudent

**Type**: `FunctionDeclaration`

```typescript
export async function deleteStudent(studentId: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |

## deleteShadowStudent

**Type**: `FunctionDeclaration`

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

## updateStudentRelation

**Type**: `FunctionDeclaration`

```typescript
export async function updateStudentRelation(studentId: string, data:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |
| data | `{ customName?: string; privateNotes?: string; }` | true |

## updateStudentSettings

**Type**: `FunctionDeclaration`

```typescript
export async function updateStudentSettings(studentId: string, formData: FormData)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| studentId | `string` | true |
| formData | `FormData` | true |

