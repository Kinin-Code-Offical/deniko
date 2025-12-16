# robots-config.ts

**Path**: `apps\web\lib\robots-config.ts`

## generateRobotsMetadata

**Type**: `FunctionDeclaration`

Generates robots metadata based on the NEXT_PUBLIC_NOINDEX environment variable.
If NEXT_PUBLIC_NOINDEX is true, it returns 'noindex, nofollow'.
Otherwise, it returns the provided default or 'index, follow'.

```typescript
export function generateRobotsMetadata(
  defaultRobots?: Metadata["robots"]
): Metadata["robots"]
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| defaultRobots | `string | import("C:/BASE/DENIKO-PROJECT/deniko/node_modules/.pnpm/next@16.0.10_@babel+core@7._59b2c4e49353e66c503ff99109bd4451/node_modules/next/dist/lib/metadata/types/metadata-types").Robots` | false |

