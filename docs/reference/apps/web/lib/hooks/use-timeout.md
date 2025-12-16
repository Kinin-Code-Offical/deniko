# use-timeout.ts

**Path**: `apps\web\lib\hooks\use-timeout.ts`

## useTimeout

**Type**: `FunctionDeclaration`

A custom hook that handles timeouts safely in React components.
Automatically clears the timeout when the component unmounts or the delay changes.

```typescript
export function useTimeout(callback: () => void, delay: number | null)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| callback | `() => void` | true |
| delay | `number` | true |

