# client.d.ts

**Path**: `packages\db\src\generated\client\runtime\client.d.ts`

## createParam

**Type**: `FunctionDeclaration`

```typescript
export declare function createParam(name: string): Param<unknown, string>;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| name | `string` | true |

## defineDmmfProperty

**Type**: `FunctionDeclaration`

```typescript
export declare function defineDmmfProperty(target: object, runtimeDataModel: RuntimeDataModel): void;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| target | `object` | true |
| runtimeDataModel | `import("C:/BASE/DENIKO-PROJECT/deniko/packages/db/src/generated/client/runtime/client").RuntimeDataModel` | true |

## deserializeJsonResponse

**Type**: `FunctionDeclaration`

```typescript
export declare function deserializeJsonResponse(result: unknown): unknown;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| result | `unknown` | true |

## deserializeRawResult

**Type**: `FunctionDeclaration`

```typescript
export declare function deserializeRawResult(response: RawResponse): DeserializedResponse;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| response | `RawResponse` | true |

## dmmfToRuntimeDataModel

**Type**: `FunctionDeclaration`

```typescript
export declare function dmmfToRuntimeDataModel(dmmfDataModel: DMMF_2.Datamodel): RuntimeDataModel;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| dmmfDataModel | `ReadonlyDeep_2<{ models: ReadonlyDeep_2<{ name: string; dbName: string; schema: string; fields: ReadonlyDeep_2<{ kind: FieldKind; name: string; isRequired: boolean; isList: boolean; isUnique: boolean; isId: boolean; isReadOnly: boolean; isGenerated?: boolean; isUpdatedAt?: boolean; type: string; nativeType?: [string, string[]]; dbName?: string; hasDefaultValue: boolean; default?: ReadonlyDeep_2<{ name: string; args: (string | number)[]; }> | FieldDefaultScalar | FieldDefaultScalar[]; relationFromFields?: string[]; relationToFields?: string[]; relationOnDelete?: string; relationOnUpdate?: string; relationName?: string; documentation?: string; }>[]; uniqueFields: string[][]; uniqueIndexes: ReadonlyDeep_2<{ name: string; fields: string[]; }>[]; documentation?: string; primaryKey: ReadonlyDeep_2<{ name: string; fields: string[]; }>; isGenerated?: boolean; }>[]; enums: ReadonlyDeep_2<{ name: string; values: ReadonlyDeep_2<{ name: string; dbName: string; }>[]; dbName?: string; documentation?: string; }>[]; types: ReadonlyDeep_2<{ name: string; dbName: string; schema: string; fields: ReadonlyDeep_2<{ kind: FieldKind; name: string; isRequired: boolean; isList: boolean; isUnique: boolean; isId: boolean; isReadOnly: boolean; isGenerated?: boolean; isUpdatedAt?: boolean; type: string; nativeType?: [string, string[]]; dbName?: string; hasDefaultValue: boolean; default?: ReadonlyDeep_2<{ name: string; args: (string | number)[]; }> | FieldDefaultScalar | FieldDefaultScalar[]; relationFromFields?: string[]; relationToFields?: string[]; relationOnDelete?: string; relationOnUpdate?: string; relationName?: string; documentation?: string; }>[]; uniqueFields: string[][]; uniqueIndexes: ReadonlyDeep_2<{ name: string; fields: string[]; }>[]; documentation?: string; primaryKey: ReadonlyDeep_2<{ name: string; fields: string[]; }>; isGenerated?: boolean; }>[]; indexes: ReadonlyDeep_2<{ model: string; type: IndexType; isDefinedOnField: boolean; name?: string; dbName?: string; algorithm?: string; clustered?: boolean; fields: ReadonlyDeep_2<{ name: string; sortOrder?: SortOrder; length?: number; operatorClass?: string; }>[]; }>[]; }>` | true |

## getPrismaClient

**Type**: `FunctionDeclaration`

```typescript
export declare function getPrismaClient(config: GetPrismaClientConfig):
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| config | `import("C:/BASE/DENIKO-PROJECT/deniko/packages/db/src/generated/client/runtime/client").GetPrismaClientConfig` | true |

## getRuntime

**Type**: `FunctionDeclaration`

```typescript
export declare function getRuntime(): GetRuntimeOutput;
```

## isTypedSql

**Type**: `FunctionDeclaration`

```typescript
export declare function isTypedSql(value: unknown): value is UnknownTypedSql;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| value | `unknown` | true |

## makeStrictEnum

**Type**: `FunctionDeclaration`

Generates more strict variant of an enum which, unlike regular enum,
throws on non-existing property access. This can be useful in following situations:
- we have an API, that accepts both `undefined` and `SomeEnumType` as an input
- enum values are generated dynamically from DMMF.

In that case, if using normal enums and no compile-time typechecking, using non-existing property
will result in `undefined` value being used, which will be accepted. Using strict enum
in this case will help to have a runtime exception, telling you that you are probably doing something wrong.

Note: if you need to check for existence of a value in the enum you can still use either
`in` operator or `hasOwnProperty` function.

```typescript
export declare function makeStrictEnum<T extends Record<PropertyKey, string | number>>(definition: T): T;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| definition | `T` | true |

## makeTypedQueryFactory

**Type**: `FunctionDeclaration`

```typescript
export declare function makeTypedQueryFactory(sql: string): (...values: any[]) => TypedSql<any[], unknown>;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| sql | `string` | true |

## Param

**Type**: `FunctionDeclaration`

```typescript
export declare function Param<$Type, $Value extends string>(name: $Value): Param<$Type, $Value>;
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| name | `$Value` | true |

## Param

**Type**: `TypeAliasDeclaration`

## serializeJsonQuery

**Type**: `FunctionDeclaration`

```typescript
export declare function serializeJsonQuery(
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| { modelName, action, args, runtimeDataModel, extensions, callsite, clientMethod, errorFormat, clientVersion, previewFeatures, globalOmit, } | `SerializeParams` | true |

## Action

**Type**: `TypeAliasDeclaration`

## Aggregate

**Type**: `TypeAliasDeclaration`

## AllModelsToStringIndex

**Type**: `TypeAliasDeclaration`

## ApplyOmit

**Type**: `TypeAliasDeclaration`

## Args

**Type**: `TypeAliasDeclaration`

## Args_3

**Type**: `TypeAliasDeclaration`

## BaseDMMF

**Type**: `TypeAliasDeclaration`

## Bytes

**Type**: `TypeAliasDeclaration`

Equivalent to `Uint8Array` before TypeScript 5.7, and `Uint8Array<ArrayBuffer>` in TypeScript 5.7 and beyond.

## Call

**Type**: `TypeAliasDeclaration`

## Cast

**Type**: `TypeAliasDeclaration`

## ClientArg

**Type**: `TypeAliasDeclaration`

## ClientArgs

**Type**: `TypeAliasDeclaration`

## ClientBuiltInProp

**Type**: `TypeAliasDeclaration`

## ClientOptionDef

**Type**: `TypeAliasDeclaration`

## ClientOtherOps

**Type**: `TypeAliasDeclaration`

## Compute

**Type**: `TypeAliasDeclaration`

## ComputeDeep

**Type**: `TypeAliasDeclaration`

## Count

**Type**: `TypeAliasDeclaration`

## Debug

**Type**: `VariableDeclaration`

## DecimalJsLike

**Type**: `InterfaceDeclaration`

Interface for any Decimal.js-like library
Allows us to accept Decimal.js from different
versions and some compatible alternatives

### Properties

| Name | Type |
|------|------|
| d | `number[]` |
| e | `number` |
| s | `number` |

## DefaultArgs

**Type**: `TypeAliasDeclaration`

## DefaultSelection

**Type**: `TypeAliasDeclaration`

## DevTypeMapDef

**Type**: `TypeAliasDeclaration`

## DevTypeMapFnDef

**Type**: `TypeAliasDeclaration`

## DMMF

**Type**: `ModuleDeclaration`

## DynamicClientExtensionArgs

**Type**: `TypeAliasDeclaration`

Client

## DynamicClientExtensionThis

**Type**: `TypeAliasDeclaration`

## DynamicClientExtensionThisBuiltin

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionArgs

**Type**: `TypeAliasDeclaration`

Model

## DynamicModelExtensionFluentApi

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionFnResult

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionFnResultBase

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionFnResultNull

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionOperationFn

**Type**: `TypeAliasDeclaration`

## DynamicModelExtensionThis

**Type**: `TypeAliasDeclaration`

## DynamicQueryExtensionArgs

**Type**: `TypeAliasDeclaration`

Query

## DynamicQueryExtensionCb

**Type**: `TypeAliasDeclaration`

## DynamicQueryExtensionCbArgs

**Type**: `TypeAliasDeclaration`

## DynamicQueryExtensionCbArgsArgs

**Type**: `TypeAliasDeclaration`

## DynamicResultExtensionArgs

**Type**: `TypeAliasDeclaration`

Result

## DynamicResultExtensionData

**Type**: `TypeAliasDeclaration`

## DynamicResultExtensionNeeds

**Type**: `TypeAliasDeclaration`

## EmptyToUnknown

**Type**: `TypeAliasDeclaration`

## Equals

**Type**: `TypeAliasDeclaration`

## Exact

**Type**: `TypeAliasDeclaration`

## ExtendsHook

**Type**: `InterfaceDeclaration`

$extends, defineExtension

### Properties

| Name | Type |
|------|------|
| extArgs | `ExtArgs` |

## ExtensionArgs

**Type**: `TypeAliasDeclaration`

## Extensions

**Type**: `ModuleDeclaration`

## ExtractGlobalOmit

**Type**: `TypeAliasDeclaration`

## FieldRef

**Type**: `InterfaceDeclaration`

A reference to a specific field of a specific model

### Properties

| Name | Type |
|------|------|
| modelName | `Model` |
| name | `string` |
| typeName | `FieldType` |
| isList | `boolean` |

## Fn

**Type**: `InterfaceDeclaration`

### Properties

| Name | Type |
|------|------|
| params | `Params` |
| returns | `Returns` |

## GetAggregateResult

**Type**: `TypeAliasDeclaration`

## GetBatchResult

**Type**: `TypeAliasDeclaration`

## GetCountResult

**Type**: `TypeAliasDeclaration`

## GetFindResult

**Type**: `TypeAliasDeclaration`

## GetGroupByResult

**Type**: `TypeAliasDeclaration`

## GetOmit

**Type**: `TypeAliasDeclaration`

## GetPayloadResult

**Type**: `TypeAliasDeclaration`

## GetPayloadResultExtensionKeys

**Type**: `TypeAliasDeclaration`

## GetPayloadResultExtensionObject

**Type**: `TypeAliasDeclaration`

## GetPrismaClientConfig

**Type**: `TypeAliasDeclaration`

Config that is stored into the generated client. When the generated client is
loaded, this same config is passed to {@link getPrismaClient} which creates a
closure with that config around a non-instantiated [[PrismaClient]].

## GetResult

**Type**: `TypeAliasDeclaration`

## GetSelect

**Type**: `TypeAliasDeclaration`

## InputJsonArray

**Type**: `InterfaceDeclaration`

Matches a JSON array.
Unlike \`JsonArray\`, readonly arrays are assignable to this type.

### Properties

| Name | Type |
|------|------|

## InputJsonObject

**Type**: `TypeAliasDeclaration`

Matches a JSON object.
Unlike \`JsonObject\`, this type allows undefined and read-only properties.

## InputJsonValue

**Type**: `TypeAliasDeclaration`

Matches any valid value that can be used as an input for operations like
create and update as the value of a JSON field. Unlike \`JsonValue\`, this
type allows read-only arrays and read-only object properties and disallows
\`null\` at the top level.

\`null\` cannot be used as the value of a JSON field because its meaning
would be ambiguous. Use \`Prisma.JsonNull\` to store the JSON null value or
\`Prisma.DbNull\` to clear the JSON value and set the field to the database
NULL value instead.

## InternalArgs

**Type**: `TypeAliasDeclaration`

## ITXClientDenyList

**Type**: `TypeAliasDeclaration`

## itxClientDenyList

**Type**: `VariableDeclaration`

## JsArgs

**Type**: `TypeAliasDeclaration`

## JsInputValue

**Type**: `TypeAliasDeclaration`

## JsonArray

**Type**: `InterfaceDeclaration`

From https://github.com/sindresorhus/type-fest/
Matches a JSON array.

### Properties

| Name | Type |
|------|------|

## JsonBatchQuery

**Type**: `TypeAliasDeclaration`

## JsonConvertible

**Type**: `InterfaceDeclaration`

### Properties

| Name | Type |
|------|------|

## JsonObject

**Type**: `TypeAliasDeclaration`

From https://github.com/sindresorhus/type-fest/
Matches a JSON object.
This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.

## JsonQuery

**Type**: `TypeAliasDeclaration`

## JsonValue

**Type**: `TypeAliasDeclaration`

From https://github.com/sindresorhus/type-fest/
Matches any valid JSON value.

## JsOutputValue

**Type**: `TypeAliasDeclaration`

## JsPromise

**Type**: `TypeAliasDeclaration`

## MergeExtArgs

**Type**: `TypeAliasDeclaration`

## ModelArg

**Type**: `TypeAliasDeclaration`

## ModelArgs

**Type**: `TypeAliasDeclaration`

## ModelKey

**Type**: `TypeAliasDeclaration`

## ModelQueryOptionsCb

**Type**: `TypeAliasDeclaration`

## ModelQueryOptionsCbArgs

**Type**: `TypeAliasDeclaration`

## NameArgs

**Type**: `TypeAliasDeclaration`

## Narrow

**Type**: `TypeAliasDeclaration`

## Narrowable

**Type**: `TypeAliasDeclaration`

## NeverToUnknown

**Type**: `TypeAliasDeclaration`

## Omission

**Type**: `TypeAliasDeclaration`

## Omit

**Type**: `TypeAliasDeclaration`

## OmitValue

**Type**: `TypeAliasDeclaration`

## Operation

**Type**: `TypeAliasDeclaration`

## OperationPayload

**Type**: `TypeAliasDeclaration`

## Optional

**Type**: `TypeAliasDeclaration`

## OptionalFlat

**Type**: `TypeAliasDeclaration`

## OptionalKeys

**Type**: `TypeAliasDeclaration`

## Or

**Type**: `TypeAliasDeclaration`

## PatchFlat

**Type**: `TypeAliasDeclaration`

## Path

**Type**: `TypeAliasDeclaration`

## Payload

**Type**: `TypeAliasDeclaration`

## PayloadToResult

**Type**: `TypeAliasDeclaration`

## Pick

**Type**: `TypeAliasDeclaration`

## PrismaClientOptions

**Type**: `TypeAliasDeclaration`

## PrismaPromise

**Type**: `InterfaceDeclaration`

### Properties

| Name | Type |
|------|------|
| [Symbol.toStringTag] | `"PrismaPromise"` |

## PrivateResultType

**Type**: `VariableDeclaration`

## Public

**Type**: `ModuleDeclaration`

## QueryOptions

**Type**: `TypeAliasDeclaration`

## QueryOptionsCb

**Type**: `TypeAliasDeclaration`

## QueryOptionsCbArgs

**Type**: `TypeAliasDeclaration`

## RawParameters

**Type**: `TypeAliasDeclaration`

## RawQueryArgs

**Type**: `TypeAliasDeclaration`

## ReadonlyDeep

**Type**: `TypeAliasDeclaration`

## Record

**Type**: `TypeAliasDeclaration`

## RenameAndNestPayloadKeys

**Type**: `TypeAliasDeclaration`

## RequiredExtensionArgs

**Type**: `TypeAliasDeclaration`

## UserArgs

**Type**: `TypeAliasDeclaration`

## RequiredKeys

**Type**: `TypeAliasDeclaration`

## Result

**Type**: `TypeAliasDeclaration`

## Result_2

**Type**: `TypeAliasDeclaration`

## ResultArg

**Type**: `TypeAliasDeclaration`

## ResultArgs

**Type**: `TypeAliasDeclaration`

## ResultArgsFieldCompute

**Type**: `TypeAliasDeclaration`

## ResultFieldDefinition

**Type**: `TypeAliasDeclaration`

## Return

**Type**: `TypeAliasDeclaration`

## RuntimeDataModel

**Type**: `TypeAliasDeclaration`

## Select

**Type**: `TypeAliasDeclaration`

## SelectablePayloadFields

**Type**: `TypeAliasDeclaration`

## SelectField

**Type**: `TypeAliasDeclaration`

## Selection

**Type**: `TypeAliasDeclaration`

## skip

**Type**: `VariableDeclaration`

## SqlCommenterContext

**Type**: `InterfaceDeclaration`

Context provided to SQL commenter plugins.

### Properties

| Name | Type |
|------|------|
| query | `import("C:/BASE/DENIKO-PROJECT/deniko/packages/db/src/generated/client/runtime/client").SqlCommenterQueryInfo` |
| sql | `string` |

## SqlCommenterPlugin

**Type**: `InterfaceDeclaration`

A SQL commenter plugin that returns key-value pairs to be added as comments.
Return an empty object to add no comments. Keys with undefined values will be omitted.

### Properties

| Name | Type |
|------|------|

## SqlCommenterQueryInfo

**Type**: `TypeAliasDeclaration`

Information about the query or queries being executed.

- `single`: A single query is being executed
- `compacted`: Multiple queries have been compacted into a single SQL statement

## SqlCommenterSingleQueryInfo

**Type**: `InterfaceDeclaration`

Information about a single Prisma query.

### Properties

| Name | Type |
|------|------|
| modelName | `string` |
| action | `JsonQueryAction` |
| query | `unknown` |

## SqlCommenterTags

**Type**: `TypeAliasDeclaration`

Key-value pairs to add as SQL comments.
Keys with undefined values will be omitted from the final comment.

## SqlDriverAdapterFactory

**Type**: `InterfaceDeclaration`

### Properties

| Name | Type |
|------|------|

## ToTuple

**Type**: `TypeAliasDeclaration`

## TypedSql

**Type**: `ClassDeclaration`

## TypeMapCbDef

**Type**: `TypeAliasDeclaration`

## TypeMapDef

**Type**: `TypeAliasDeclaration`

Shared

## Types

**Type**: `ModuleDeclaration`

## UnknownTypedSql

**Type**: `TypeAliasDeclaration`

## UnwrapPayload

**Type**: `TypeAliasDeclaration`

## UnwrapPromise

**Type**: `TypeAliasDeclaration`

## UnwrapTuple

**Type**: `TypeAliasDeclaration`

## warnOnce

**Type**: `VariableDeclaration`

