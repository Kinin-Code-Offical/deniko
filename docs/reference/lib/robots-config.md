# robots-config.ts

**Path**: `lib\robots-config.ts`

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
| defaultRobots | `string | import("C:/BASE/DENIKO-PROJECT/deniko/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/lib/metadata/types/metadata-types").Robots | null | undefined` | false |

