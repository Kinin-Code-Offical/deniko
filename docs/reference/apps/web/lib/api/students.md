# students.ts

**Path**: `apps\web\lib\api\students.ts`

## getStudents

**Type**: `FunctionDeclaration`

```typescript
export async function getStudents()
```

## getStudent

**Type**: `FunctionDeclaration`

```typescript
export async function getStudent(id: string): Promise<StudentDetailResponse | null>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| id | `string` | true |

## StudentDetailResponse

**Type**: `TypeAliasDeclaration`

