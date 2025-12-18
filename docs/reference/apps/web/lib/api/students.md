# students.ts

**Path**: `apps\web\lib\api\students.ts`

## getStudents

**Type**: `FunctionDeclaration`

```typescript
export async function getStudents(lang?: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| lang | `string` | false |

## getStudent

**Type**: `FunctionDeclaration`

```typescript
export async function getStudent(id: string, lang?: string): Promise<StudentDetailResponse>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| id | `string` | true |
| lang | `string` | false |

## StudentDetailResponse

**Type**: `TypeAliasDeclaration`

