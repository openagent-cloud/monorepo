
/**
 * Client
**/

import * as runtime from './runtime/binary.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model blog
 * 
 */
export type blog = $Result.DefaultSelection<Prisma.$blogPayload>
/**
 * Model comment
 * 
 */
export type comment = $Result.DefaultSelection<Prisma.$commentPayload>
/**
 * Model token
 * 
 */
export type token = $Result.DefaultSelection<Prisma.$tokenPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const token_type: {
  access: 'access',
  email_verification: 'email_verification',
  password_reset: 'password_reset',
  refresh: 'refresh',
  siwe: 'siwe'
};

export type token_type = (typeof token_type)[keyof typeof token_type]


export const user_role: {
  admin: 'admin',
  super_admin: 'super_admin',
  user: 'user'
};

export type user_role = (typeof user_role)[keyof typeof user_role]

}

export type token_type = $Enums.token_type

export const token_type: typeof $Enums.token_type

export type user_role = $Enums.user_role

export const user_role: typeof $Enums.user_role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Blogs
 * const blogs = await prisma.blog.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Blogs
   * const blogs = await prisma.blog.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => $Utils.JsPromise<void> : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.blog`: Exposes CRUD operations for the **blog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Blogs
    * const blogs = await prisma.blog.findMany()
    * ```
    */
  get blog(): Prisma.blogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.commentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.token`: Exposes CRUD operations for the **token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.tokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    blog: 'blog',
    comment: 'comment',
    token: 'token',
    user: 'user'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "blog" | "comment" | "token" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      blog: {
        payload: Prisma.$blogPayload<ExtArgs>
        fields: Prisma.blogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.blogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.blogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          findFirst: {
            args: Prisma.blogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.blogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          findMany: {
            args: Prisma.blogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>[]
          }
          create: {
            args: Prisma.blogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          createMany: {
            args: Prisma.blogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.blogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>[]
          }
          delete: {
            args: Prisma.blogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          update: {
            args: Prisma.blogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          deleteMany: {
            args: Prisma.blogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.blogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.blogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>[]
          }
          upsert: {
            args: Prisma.blogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$blogPayload>
          }
          aggregate: {
            args: Prisma.BlogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlog>
          }
          groupBy: {
            args: Prisma.blogGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogGroupByOutputType>[]
          }
          count: {
            args: Prisma.blogCountArgs<ExtArgs>
            result: $Utils.Optional<BlogCountAggregateOutputType> | number
          }
        }
      }
      comment: {
        payload: Prisma.$commentPayload<ExtArgs>
        fields: Prisma.commentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.commentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.commentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          findFirst: {
            args: Prisma.commentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.commentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          findMany: {
            args: Prisma.commentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>[]
          }
          create: {
            args: Prisma.commentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          createMany: {
            args: Prisma.commentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.commentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>[]
          }
          delete: {
            args: Prisma.commentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          update: {
            args: Prisma.commentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          deleteMany: {
            args: Prisma.commentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.commentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.commentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>[]
          }
          upsert: {
            args: Prisma.commentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.commentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.commentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      token: {
        payload: Prisma.$tokenPayload<ExtArgs>
        fields: Prisma.tokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          findFirst: {
            args: Prisma.tokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          findMany: {
            args: Prisma.tokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>[]
          }
          create: {
            args: Prisma.tokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          createMany: {
            args: Prisma.tokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>[]
          }
          delete: {
            args: Prisma.tokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          update: {
            args: Prisma.tokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          deleteMany: {
            args: Prisma.tokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>[]
          }
          upsert: {
            args: Prisma.tokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.tokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.tokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.userCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.userUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    blog?: blogOmit
    comment?: commentOmit
    token?: tokenOmit
    user?: userOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BlogCountOutputType
   */

  export type BlogCountOutputType = {
    comments: number
  }

  export type BlogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | BlogCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * BlogCountOutputType without action
   */
  export type BlogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCountOutputType
     */
    select?: BlogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogCountOutputType without action
   */
  export type BlogCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: commentWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    tokens: number
    blogs: number
    comments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tokens?: boolean | UserCountOutputTypeCountTokensArgs
    blogs?: boolean | UserCountOutputTypeCountBlogsArgs
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBlogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: blogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: commentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model blog
   */

  export type AggregateBlog = {
    _count: BlogCountAggregateOutputType | null
    _avg: BlogAvgAggregateOutputType | null
    _sum: BlogSumAggregateOutputType | null
    _min: BlogMinAggregateOutputType | null
    _max: BlogMaxAggregateOutputType | null
  }

  export type BlogAvgAggregateOutputType = {
    author_id: number | null
  }

  export type BlogSumAggregateOutputType = {
    author_id: number | null
  }

  export type BlogMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    published: boolean | null
    author_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BlogMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    published: boolean | null
    author_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BlogCountAggregateOutputType = {
    id: number
    title: number
    content: number
    published: number
    author_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type BlogAvgAggregateInputType = {
    author_id?: true
  }

  export type BlogSumAggregateInputType = {
    author_id?: true
  }

  export type BlogMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    published?: true
    author_id?: true
    created_at?: true
    updated_at?: true
  }

  export type BlogMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    published?: true
    author_id?: true
    created_at?: true
    updated_at?: true
  }

  export type BlogCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    published?: true
    author_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type BlogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which blog to aggregate.
     */
    where?: blogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of blogs to fetch.
     */
    orderBy?: blogOrderByWithRelationInput | blogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: blogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned blogs
    **/
    _count?: true | BlogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BlogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BlogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlogMaxAggregateInputType
  }

  export type GetBlogAggregateType<T extends BlogAggregateArgs> = {
        [P in keyof T & keyof AggregateBlog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlog[P]>
      : GetScalarType<T[P], AggregateBlog[P]>
  }




  export type blogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: blogWhereInput
    orderBy?: blogOrderByWithAggregationInput | blogOrderByWithAggregationInput[]
    by: BlogScalarFieldEnum[] | BlogScalarFieldEnum
    having?: blogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogCountAggregateInputType | true
    _avg?: BlogAvgAggregateInputType
    _sum?: BlogSumAggregateInputType
    _min?: BlogMinAggregateInputType
    _max?: BlogMaxAggregateInputType
  }

  export type BlogGroupByOutputType = {
    id: string
    title: string
    content: string
    published: boolean
    author_id: number
    created_at: Date
    updated_at: Date
    _count: BlogCountAggregateOutputType | null
    _avg: BlogAvgAggregateOutputType | null
    _sum: BlogSumAggregateOutputType | null
    _min: BlogMinAggregateOutputType | null
    _max: BlogMaxAggregateOutputType | null
  }

  type GetBlogGroupByPayload<T extends blogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlogGroupByOutputType[P]>
            : GetScalarType<T[P], BlogGroupByOutputType[P]>
        }
      >
    >


  export type blogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | userDefaultArgs<ExtArgs>
    comments?: boolean | blog$commentsArgs<ExtArgs>
    _count?: boolean | BlogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["blog"]>

  export type blogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["blog"]>

  export type blogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["blog"]>

  export type blogSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type blogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "published" | "author_id" | "created_at" | "updated_at", ExtArgs["result"]["blog"]>
  export type blogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | userDefaultArgs<ExtArgs>
    comments?: boolean | blog$commentsArgs<ExtArgs>
    _count?: boolean | BlogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type blogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | userDefaultArgs<ExtArgs>
  }
  export type blogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $blogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "blog"
    objects: {
      author: Prisma.$userPayload<ExtArgs>
      comments: Prisma.$commentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      published: boolean
      author_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["blog"]>
    composites: {}
  }

  type blogGetPayload<S extends boolean | null | undefined | blogDefaultArgs> = $Result.GetResult<Prisma.$blogPayload, S>

  type blogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<blogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogCountAggregateInputType | true
    }

  export interface blogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['blog'], meta: { name: 'blog' } }
    /**
     * Find zero or one Blog that matches the filter.
     * @param {blogFindUniqueArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends blogFindUniqueArgs>(args: SelectSubset<T, blogFindUniqueArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Blog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {blogFindUniqueOrThrowArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends blogFindUniqueOrThrowArgs>(args: SelectSubset<T, blogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Blog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogFindFirstArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends blogFindFirstArgs>(args?: SelectSubset<T, blogFindFirstArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Blog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogFindFirstOrThrowArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends blogFindFirstOrThrowArgs>(args?: SelectSubset<T, blogFindFirstOrThrowArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Blogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Blogs
     * const blogs = await prisma.blog.findMany()
     * 
     * // Get first 10 Blogs
     * const blogs = await prisma.blog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blogWithIdOnly = await prisma.blog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends blogFindManyArgs>(args?: SelectSubset<T, blogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Blog.
     * @param {blogCreateArgs} args - Arguments to create a Blog.
     * @example
     * // Create one Blog
     * const Blog = await prisma.blog.create({
     *   data: {
     *     // ... data to create a Blog
     *   }
     * })
     * 
     */
    create<T extends blogCreateArgs>(args: SelectSubset<T, blogCreateArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Blogs.
     * @param {blogCreateManyArgs} args - Arguments to create many Blogs.
     * @example
     * // Create many Blogs
     * const blog = await prisma.blog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends blogCreateManyArgs>(args?: SelectSubset<T, blogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Blogs and returns the data saved in the database.
     * @param {blogCreateManyAndReturnArgs} args - Arguments to create many Blogs.
     * @example
     * // Create many Blogs
     * const blog = await prisma.blog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Blogs and only return the `id`
     * const blogWithIdOnly = await prisma.blog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends blogCreateManyAndReturnArgs>(args?: SelectSubset<T, blogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Blog.
     * @param {blogDeleteArgs} args - Arguments to delete one Blog.
     * @example
     * // Delete one Blog
     * const Blog = await prisma.blog.delete({
     *   where: {
     *     // ... filter to delete one Blog
     *   }
     * })
     * 
     */
    delete<T extends blogDeleteArgs>(args: SelectSubset<T, blogDeleteArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Blog.
     * @param {blogUpdateArgs} args - Arguments to update one Blog.
     * @example
     * // Update one Blog
     * const blog = await prisma.blog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends blogUpdateArgs>(args: SelectSubset<T, blogUpdateArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Blogs.
     * @param {blogDeleteManyArgs} args - Arguments to filter Blogs to delete.
     * @example
     * // Delete a few Blogs
     * const { count } = await prisma.blog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends blogDeleteManyArgs>(args?: SelectSubset<T, blogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Blogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Blogs
     * const blog = await prisma.blog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends blogUpdateManyArgs>(args: SelectSubset<T, blogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Blogs and returns the data updated in the database.
     * @param {blogUpdateManyAndReturnArgs} args - Arguments to update many Blogs.
     * @example
     * // Update many Blogs
     * const blog = await prisma.blog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Blogs and only return the `id`
     * const blogWithIdOnly = await prisma.blog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends blogUpdateManyAndReturnArgs>(args: SelectSubset<T, blogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Blog.
     * @param {blogUpsertArgs} args - Arguments to update or create a Blog.
     * @example
     * // Update or create a Blog
     * const blog = await prisma.blog.upsert({
     *   create: {
     *     // ... data to create a Blog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Blog we want to update
     *   }
     * })
     */
    upsert<T extends blogUpsertArgs>(args: SelectSubset<T, blogUpsertArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Blogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogCountArgs} args - Arguments to filter Blogs to count.
     * @example
     * // Count the number of Blogs
     * const count = await prisma.blog.count({
     *   where: {
     *     // ... the filter for the Blogs we want to count
     *   }
     * })
    **/
    count<T extends blogCountArgs>(
      args?: Subset<T, blogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Blog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BlogAggregateArgs>(args: Subset<T, BlogAggregateArgs>): Prisma.PrismaPromise<GetBlogAggregateType<T>>

    /**
     * Group by Blog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends blogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: blogGroupByArgs['orderBy'] }
        : { orderBy?: blogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, blogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the blog model
   */
  readonly fields: blogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for blog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__blogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends blog$commentsArgs<ExtArgs> = {}>(args?: Subset<T, blog$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the blog model
   */
  interface blogFieldRefs {
    readonly id: FieldRef<"blog", 'String'>
    readonly title: FieldRef<"blog", 'String'>
    readonly content: FieldRef<"blog", 'String'>
    readonly published: FieldRef<"blog", 'Boolean'>
    readonly author_id: FieldRef<"blog", 'Int'>
    readonly created_at: FieldRef<"blog", 'DateTime'>
    readonly updated_at: FieldRef<"blog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * blog findUnique
   */
  export type blogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter, which blog to fetch.
     */
    where: blogWhereUniqueInput
  }

  /**
   * blog findUniqueOrThrow
   */
  export type blogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter, which blog to fetch.
     */
    where: blogWhereUniqueInput
  }

  /**
   * blog findFirst
   */
  export type blogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter, which blog to fetch.
     */
    where?: blogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of blogs to fetch.
     */
    orderBy?: blogOrderByWithRelationInput | blogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for blogs.
     */
    cursor?: blogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of blogs.
     */
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * blog findFirstOrThrow
   */
  export type blogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter, which blog to fetch.
     */
    where?: blogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of blogs to fetch.
     */
    orderBy?: blogOrderByWithRelationInput | blogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for blogs.
     */
    cursor?: blogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of blogs.
     */
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * blog findMany
   */
  export type blogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter, which blogs to fetch.
     */
    where?: blogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of blogs to fetch.
     */
    orderBy?: blogOrderByWithRelationInput | blogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing blogs.
     */
    cursor?: blogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` blogs.
     */
    skip?: number
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * blog create
   */
  export type blogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * The data needed to create a blog.
     */
    data: XOR<blogCreateInput, blogUncheckedCreateInput>
  }

  /**
   * blog createMany
   */
  export type blogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many blogs.
     */
    data: blogCreateManyInput | blogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * blog createManyAndReturn
   */
  export type blogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * The data used to create many blogs.
     */
    data: blogCreateManyInput | blogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * blog update
   */
  export type blogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * The data needed to update a blog.
     */
    data: XOR<blogUpdateInput, blogUncheckedUpdateInput>
    /**
     * Choose, which blog to update.
     */
    where: blogWhereUniqueInput
  }

  /**
   * blog updateMany
   */
  export type blogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update blogs.
     */
    data: XOR<blogUpdateManyMutationInput, blogUncheckedUpdateManyInput>
    /**
     * Filter which blogs to update
     */
    where?: blogWhereInput
    /**
     * Limit how many blogs to update.
     */
    limit?: number
  }

  /**
   * blog updateManyAndReturn
   */
  export type blogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * The data used to update blogs.
     */
    data: XOR<blogUpdateManyMutationInput, blogUncheckedUpdateManyInput>
    /**
     * Filter which blogs to update
     */
    where?: blogWhereInput
    /**
     * Limit how many blogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * blog upsert
   */
  export type blogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * The filter to search for the blog to update in case it exists.
     */
    where: blogWhereUniqueInput
    /**
     * In case the blog found by the `where` argument doesn't exist, create a new blog with this data.
     */
    create: XOR<blogCreateInput, blogUncheckedCreateInput>
    /**
     * In case the blog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<blogUpdateInput, blogUncheckedUpdateInput>
  }

  /**
   * blog delete
   */
  export type blogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    /**
     * Filter which blog to delete.
     */
    where: blogWhereUniqueInput
  }

  /**
   * blog deleteMany
   */
  export type blogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which blogs to delete
     */
    where?: blogWhereInput
    /**
     * Limit how many blogs to delete.
     */
    limit?: number
  }

  /**
   * blog.comments
   */
  export type blog$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    where?: commentWhereInput
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    cursor?: commentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * blog without action
   */
  export type blogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
  }


  /**
   * Model comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentAvgAggregateOutputType = {
    author_id: number | null
  }

  export type CommentSumAggregateOutputType = {
    author_id: number | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    content: string | null
    blog_id: string | null
    author_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    content: string | null
    blog_id: string | null
    author_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    content: number
    blog_id: number
    author_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CommentAvgAggregateInputType = {
    author_id?: true
  }

  export type CommentSumAggregateInputType = {
    author_id?: true
  }

  export type CommentMinAggregateInputType = {
    id?: true
    content?: true
    blog_id?: true
    author_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    content?: true
    blog_id?: true
    author_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    content?: true
    blog_id?: true
    author_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which comment to aggregate.
     */
    where?: commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of comments to fetch.
     */
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type commentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: commentWhereInput
    orderBy?: commentOrderByWithAggregationInput | commentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: commentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _avg?: CommentAvgAggregateInputType
    _sum?: CommentSumAggregateInputType
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    content: string
    blog_id: string
    author_id: number
    created_at: Date
    updated_at: Date
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends commentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type commentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    blog_id?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type commentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    blog_id?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type commentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    blog_id?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type commentSelectScalar = {
    id?: boolean
    content?: boolean
    blog_id?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type commentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "blog_id" | "author_id" | "created_at" | "updated_at", ExtArgs["result"]["comment"]>
  export type commentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }
  export type commentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }
  export type commentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blog?: boolean | blogDefaultArgs<ExtArgs>
    author?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $commentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "comment"
    objects: {
      blog: Prisma.$blogPayload<ExtArgs>
      author: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      blog_id: string
      author_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type commentGetPayload<S extends boolean | null | undefined | commentDefaultArgs> = $Result.GetResult<Prisma.$commentPayload, S>

  type commentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<commentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface commentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['comment'], meta: { name: 'comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {commentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends commentFindUniqueArgs>(args: SelectSubset<T, commentFindUniqueArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {commentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends commentFindUniqueOrThrowArgs>(args: SelectSubset<T, commentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends commentFindFirstArgs>(args?: SelectSubset<T, commentFindFirstArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends commentFindFirstOrThrowArgs>(args?: SelectSubset<T, commentFindFirstOrThrowArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends commentFindManyArgs>(args?: SelectSubset<T, commentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {commentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends commentCreateArgs>(args: SelectSubset<T, commentCreateArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {commentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends commentCreateManyArgs>(args?: SelectSubset<T, commentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {commentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends commentCreateManyAndReturnArgs>(args?: SelectSubset<T, commentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {commentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends commentDeleteArgs>(args: SelectSubset<T, commentDeleteArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {commentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends commentUpdateArgs>(args: SelectSubset<T, commentUpdateArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {commentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends commentDeleteManyArgs>(args?: SelectSubset<T, commentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends commentUpdateManyArgs>(args: SelectSubset<T, commentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {commentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends commentUpdateManyAndReturnArgs>(args: SelectSubset<T, commentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {commentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends commentUpsertArgs>(args: SelectSubset<T, commentUpsertArgs<ExtArgs>>): Prisma__commentClient<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends commentCountArgs>(
      args?: Subset<T, commentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends commentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: commentGroupByArgs['orderBy'] }
        : { orderBy?: commentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, commentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the comment model
   */
  readonly fields: commentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__commentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    blog<T extends blogDefaultArgs<ExtArgs> = {}>(args?: Subset<T, blogDefaultArgs<ExtArgs>>): Prisma__blogClient<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the comment model
   */
  interface commentFieldRefs {
    readonly id: FieldRef<"comment", 'String'>
    readonly content: FieldRef<"comment", 'String'>
    readonly blog_id: FieldRef<"comment", 'String'>
    readonly author_id: FieldRef<"comment", 'Int'>
    readonly created_at: FieldRef<"comment", 'DateTime'>
    readonly updated_at: FieldRef<"comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * comment findUnique
   */
  export type commentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter, which comment to fetch.
     */
    where: commentWhereUniqueInput
  }

  /**
   * comment findUniqueOrThrow
   */
  export type commentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter, which comment to fetch.
     */
    where: commentWhereUniqueInput
  }

  /**
   * comment findFirst
   */
  export type commentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter, which comment to fetch.
     */
    where?: commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of comments to fetch.
     */
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for comments.
     */
    cursor?: commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * comment findFirstOrThrow
   */
  export type commentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter, which comment to fetch.
     */
    where?: commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of comments to fetch.
     */
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for comments.
     */
    cursor?: commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * comment findMany
   */
  export type commentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter, which comments to fetch.
     */
    where?: commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of comments to fetch.
     */
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing comments.
     */
    cursor?: commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * comment create
   */
  export type commentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * The data needed to create a comment.
     */
    data: XOR<commentCreateInput, commentUncheckedCreateInput>
  }

  /**
   * comment createMany
   */
  export type commentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many comments.
     */
    data: commentCreateManyInput | commentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * comment createManyAndReturn
   */
  export type commentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * The data used to create many comments.
     */
    data: commentCreateManyInput | commentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * comment update
   */
  export type commentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * The data needed to update a comment.
     */
    data: XOR<commentUpdateInput, commentUncheckedUpdateInput>
    /**
     * Choose, which comment to update.
     */
    where: commentWhereUniqueInput
  }

  /**
   * comment updateMany
   */
  export type commentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update comments.
     */
    data: XOR<commentUpdateManyMutationInput, commentUncheckedUpdateManyInput>
    /**
     * Filter which comments to update
     */
    where?: commentWhereInput
    /**
     * Limit how many comments to update.
     */
    limit?: number
  }

  /**
   * comment updateManyAndReturn
   */
  export type commentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * The data used to update comments.
     */
    data: XOR<commentUpdateManyMutationInput, commentUncheckedUpdateManyInput>
    /**
     * Filter which comments to update
     */
    where?: commentWhereInput
    /**
     * Limit how many comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * comment upsert
   */
  export type commentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * The filter to search for the comment to update in case it exists.
     */
    where: commentWhereUniqueInput
    /**
     * In case the comment found by the `where` argument doesn't exist, create a new comment with this data.
     */
    create: XOR<commentCreateInput, commentUncheckedCreateInput>
    /**
     * In case the comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<commentUpdateInput, commentUncheckedUpdateInput>
  }

  /**
   * comment delete
   */
  export type commentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    /**
     * Filter which comment to delete.
     */
    where: commentWhereUniqueInput
  }

  /**
   * comment deleteMany
   */
  export type commentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which comments to delete
     */
    where?: commentWhereInput
    /**
     * Limit how many comments to delete.
     */
    limit?: number
  }

  /**
   * comment without action
   */
  export type commentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
  }


  /**
   * Model token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type TokenSumAggregateOutputType = {
    id: number | null
    user_id: number | null
  }

  export type TokenMinAggregateOutputType = {
    created_at: Date | null
    expires_at: Date | null
    id: number | null
    token: string | null
    token_hash: string | null
    type: $Enums.token_type | null
    updated_at: Date | null
    user_id: number | null
    uuid: string | null
  }

  export type TokenMaxAggregateOutputType = {
    created_at: Date | null
    expires_at: Date | null
    id: number | null
    token: string | null
    token_hash: string | null
    type: $Enums.token_type | null
    updated_at: Date | null
    user_id: number | null
    uuid: string | null
  }

  export type TokenCountAggregateOutputType = {
    created_at: number
    expires_at: number
    id: number
    metadata: number
    token: number
    token_hash: number
    type: number
    updated_at: number
    user_id: number
    uuid: number
    _all: number
  }


  export type TokenAvgAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type TokenSumAggregateInputType = {
    id?: true
    user_id?: true
  }

  export type TokenMinAggregateInputType = {
    created_at?: true
    expires_at?: true
    id?: true
    token?: true
    token_hash?: true
    type?: true
    updated_at?: true
    user_id?: true
    uuid?: true
  }

  export type TokenMaxAggregateInputType = {
    created_at?: true
    expires_at?: true
    id?: true
    token?: true
    token_hash?: true
    type?: true
    updated_at?: true
    user_id?: true
    uuid?: true
  }

  export type TokenCountAggregateInputType = {
    created_at?: true
    expires_at?: true
    id?: true
    metadata?: true
    token?: true
    token_hash?: true
    type?: true
    updated_at?: true
    user_id?: true
    uuid?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which token to aggregate.
     */
    where?: tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tokens to fetch.
     */
    orderBy?: tokenOrderByWithRelationInput | tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type tokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tokenWhereInput
    orderBy?: tokenOrderByWithAggregationInput | tokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: tokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _avg?: TokenAvgAggregateInputType
    _sum?: TokenSumAggregateInputType
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    created_at: Date
    expires_at: Date
    id: number
    metadata: JsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at: Date
    user_id: number
    uuid: string | null
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends tokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type tokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    created_at?: boolean
    expires_at?: boolean
    id?: boolean
    metadata?: boolean
    token?: boolean
    token_hash?: boolean
    type?: boolean
    updated_at?: boolean
    user_id?: boolean
    uuid?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type tokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    created_at?: boolean
    expires_at?: boolean
    id?: boolean
    metadata?: boolean
    token?: boolean
    token_hash?: boolean
    type?: boolean
    updated_at?: boolean
    user_id?: boolean
    uuid?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type tokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    created_at?: boolean
    expires_at?: boolean
    id?: boolean
    metadata?: boolean
    token?: boolean
    token_hash?: boolean
    type?: boolean
    updated_at?: boolean
    user_id?: boolean
    uuid?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type tokenSelectScalar = {
    created_at?: boolean
    expires_at?: boolean
    id?: boolean
    metadata?: boolean
    token?: boolean
    token_hash?: boolean
    type?: boolean
    updated_at?: boolean
    user_id?: boolean
    uuid?: boolean
  }

  export type tokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"created_at" | "expires_at" | "id" | "metadata" | "token" | "token_hash" | "type" | "updated_at" | "user_id" | "uuid", ExtArgs["result"]["token"]>
  export type tokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type tokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type tokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $tokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "token"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      created_at: Date
      expires_at: Date
      id: number
      metadata: Prisma.JsonValue
      token: string
      token_hash: string
      type: $Enums.token_type
      updated_at: Date
      user_id: number
      uuid: string | null
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type tokenGetPayload<S extends boolean | null | undefined | tokenDefaultArgs> = $Result.GetResult<Prisma.$tokenPayload, S>

  type tokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface tokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['token'], meta: { name: 'token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {tokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tokenFindUniqueArgs>(args: SelectSubset<T, tokenFindUniqueArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tokenFindUniqueOrThrowArgs>(args: SelectSubset<T, tokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tokenFindFirstArgs>(args?: SelectSubset<T, tokenFindFirstArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tokenFindFirstOrThrowArgs>(args?: SelectSubset<T, tokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `created_at`
     * const tokenWithCreated_atOnly = await prisma.token.findMany({ select: { created_at: true } })
     * 
     */
    findMany<T extends tokenFindManyArgs>(args?: SelectSubset<T, tokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {tokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends tokenCreateArgs>(args: SelectSubset<T, tokenCreateArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {tokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tokenCreateManyArgs>(args?: SelectSubset<T, tokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tokens and returns the data saved in the database.
     * @param {tokenCreateManyAndReturnArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tokens and only return the `created_at`
     * const tokenWithCreated_atOnly = await prisma.token.createManyAndReturn({
     *   select: { created_at: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tokenCreateManyAndReturnArgs>(args?: SelectSubset<T, tokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Token.
     * @param {tokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends tokenDeleteArgs>(args: SelectSubset<T, tokenDeleteArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {tokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tokenUpdateArgs>(args: SelectSubset<T, tokenUpdateArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {tokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tokenDeleteManyArgs>(args?: SelectSubset<T, tokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tokenUpdateManyArgs>(args: SelectSubset<T, tokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens and returns the data updated in the database.
     * @param {tokenUpdateManyAndReturnArgs} args - Arguments to update many Tokens.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tokens and only return the `created_at`
     * const tokenWithCreated_atOnly = await prisma.token.updateManyAndReturn({
     *   select: { created_at: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tokenUpdateManyAndReturnArgs>(args: SelectSubset<T, tokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Token.
     * @param {tokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends tokenUpsertArgs>(args: SelectSubset<T, tokenUpsertArgs<ExtArgs>>): Prisma__tokenClient<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends tokenCountArgs>(
      args?: Subset<T, tokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tokenGroupByArgs['orderBy'] }
        : { orderBy?: tokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the token model
   */
  readonly fields: tokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the token model
   */
  interface tokenFieldRefs {
    readonly created_at: FieldRef<"token", 'DateTime'>
    readonly expires_at: FieldRef<"token", 'DateTime'>
    readonly id: FieldRef<"token", 'Int'>
    readonly metadata: FieldRef<"token", 'Json'>
    readonly token: FieldRef<"token", 'String'>
    readonly token_hash: FieldRef<"token", 'String'>
    readonly type: FieldRef<"token", 'token_type'>
    readonly updated_at: FieldRef<"token", 'DateTime'>
    readonly user_id: FieldRef<"token", 'Int'>
    readonly uuid: FieldRef<"token", 'String'>
  }
    

  // Custom InputTypes
  /**
   * token findUnique
   */
  export type tokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter, which token to fetch.
     */
    where: tokenWhereUniqueInput
  }

  /**
   * token findUniqueOrThrow
   */
  export type tokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter, which token to fetch.
     */
    where: tokenWhereUniqueInput
  }

  /**
   * token findFirst
   */
  export type tokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter, which token to fetch.
     */
    where?: tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tokens to fetch.
     */
    orderBy?: tokenOrderByWithRelationInput | tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tokens.
     */
    cursor?: tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * token findFirstOrThrow
   */
  export type tokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter, which token to fetch.
     */
    where?: tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tokens to fetch.
     */
    orderBy?: tokenOrderByWithRelationInput | tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tokens.
     */
    cursor?: tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * token findMany
   */
  export type tokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter, which tokens to fetch.
     */
    where?: tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tokens to fetch.
     */
    orderBy?: tokenOrderByWithRelationInput | tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tokens.
     */
    cursor?: tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * token create
   */
  export type tokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * The data needed to create a token.
     */
    data: XOR<tokenCreateInput, tokenUncheckedCreateInput>
  }

  /**
   * token createMany
   */
  export type tokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tokens.
     */
    data: tokenCreateManyInput | tokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * token createManyAndReturn
   */
  export type tokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * The data used to create many tokens.
     */
    data: tokenCreateManyInput | tokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * token update
   */
  export type tokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * The data needed to update a token.
     */
    data: XOR<tokenUpdateInput, tokenUncheckedUpdateInput>
    /**
     * Choose, which token to update.
     */
    where: tokenWhereUniqueInput
  }

  /**
   * token updateMany
   */
  export type tokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tokens.
     */
    data: XOR<tokenUpdateManyMutationInput, tokenUncheckedUpdateManyInput>
    /**
     * Filter which tokens to update
     */
    where?: tokenWhereInput
    /**
     * Limit how many tokens to update.
     */
    limit?: number
  }

  /**
   * token updateManyAndReturn
   */
  export type tokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * The data used to update tokens.
     */
    data: XOR<tokenUpdateManyMutationInput, tokenUncheckedUpdateManyInput>
    /**
     * Filter which tokens to update
     */
    where?: tokenWhereInput
    /**
     * Limit how many tokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * token upsert
   */
  export type tokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * The filter to search for the token to update in case it exists.
     */
    where: tokenWhereUniqueInput
    /**
     * In case the token found by the `where` argument doesn't exist, create a new token with this data.
     */
    create: XOR<tokenCreateInput, tokenUncheckedCreateInput>
    /**
     * In case the token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tokenUpdateInput, tokenUncheckedUpdateInput>
  }

  /**
   * token delete
   */
  export type tokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    /**
     * Filter which token to delete.
     */
    where: tokenWhereUniqueInput
  }

  /**
   * token deleteMany
   */
  export type tokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tokens to delete
     */
    where?: tokenWhereInput
    /**
     * Limit how many tokens to delete.
     */
    limit?: number
  }

  /**
   * token without action
   */
  export type tokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    avatar_url: string | null
    cover_url: string | null
    created_at: Date | null
    deleted_at: Date | null
    email: string | null
    eth_address: string | null
    face_prompt: string | null
    header_image_url: string | null
    id: number | null
    is_active: boolean | null
    is_2fa_enabled: boolean | null
    is_email_verified: boolean | null
    is_eth_address_verified: boolean | null
    last_login: Date | null
    name: string | null
    password_hash: string | null
    role: $Enums.user_role | null
    token2fa: string | null
    updated_at: Date | null
    username: string | null
    uuid: string | null
  }

  export type UserMaxAggregateOutputType = {
    avatar_url: string | null
    cover_url: string | null
    created_at: Date | null
    deleted_at: Date | null
    email: string | null
    eth_address: string | null
    face_prompt: string | null
    header_image_url: string | null
    id: number | null
    is_active: boolean | null
    is_2fa_enabled: boolean | null
    is_email_verified: boolean | null
    is_eth_address_verified: boolean | null
    last_login: Date | null
    name: string | null
    password_hash: string | null
    role: $Enums.user_role | null
    token2fa: string | null
    updated_at: Date | null
    username: string | null
    uuid: string | null
  }

  export type UserCountAggregateOutputType = {
    avatar_url: number
    cover_url: number
    created_at: number
    deleted_at: number
    email: number
    eth_address: number
    face_prompt: number
    header_image_url: number
    id: number
    is_active: number
    is_2fa_enabled: number
    is_email_verified: number
    is_eth_address_verified: number
    last_login: number
    metadata: number
    name: number
    password_hash: number
    role: number
    token2fa: number
    updated_at: number
    username: number
    uuid: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    avatar_url?: true
    cover_url?: true
    created_at?: true
    deleted_at?: true
    email?: true
    eth_address?: true
    face_prompt?: true
    header_image_url?: true
    id?: true
    is_active?: true
    is_2fa_enabled?: true
    is_email_verified?: true
    is_eth_address_verified?: true
    last_login?: true
    name?: true
    password_hash?: true
    role?: true
    token2fa?: true
    updated_at?: true
    username?: true
    uuid?: true
  }

  export type UserMaxAggregateInputType = {
    avatar_url?: true
    cover_url?: true
    created_at?: true
    deleted_at?: true
    email?: true
    eth_address?: true
    face_prompt?: true
    header_image_url?: true
    id?: true
    is_active?: true
    is_2fa_enabled?: true
    is_email_verified?: true
    is_eth_address_verified?: true
    last_login?: true
    name?: true
    password_hash?: true
    role?: true
    token2fa?: true
    updated_at?: true
    username?: true
    uuid?: true
  }

  export type UserCountAggregateInputType = {
    avatar_url?: true
    cover_url?: true
    created_at?: true
    deleted_at?: true
    email?: true
    eth_address?: true
    face_prompt?: true
    header_image_url?: true
    id?: true
    is_active?: true
    is_2fa_enabled?: true
    is_email_verified?: true
    is_eth_address_verified?: true
    last_login?: true
    metadata?: true
    name?: true
    password_hash?: true
    role?: true
    token2fa?: true
    updated_at?: true
    username?: true
    uuid?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    avatar_url: string | null
    cover_url: string | null
    created_at: Date
    deleted_at: Date | null
    email: string
    eth_address: string | null
    face_prompt: string | null
    header_image_url: string | null
    id: number
    is_active: boolean
    is_2fa_enabled: boolean
    is_email_verified: boolean
    is_eth_address_verified: boolean
    last_login: Date | null
    metadata: JsonValue
    name: string
    password_hash: string | null
    role: $Enums.user_role
    token2fa: string | null
    updated_at: Date
    username: string
    uuid: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    avatar_url?: boolean
    cover_url?: boolean
    created_at?: boolean
    deleted_at?: boolean
    email?: boolean
    eth_address?: boolean
    face_prompt?: boolean
    header_image_url?: boolean
    id?: boolean
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: boolean
    metadata?: boolean
    name?: boolean
    password_hash?: boolean
    role?: boolean
    token2fa?: boolean
    updated_at?: boolean
    username?: boolean
    uuid?: boolean
    tokens?: boolean | user$tokensArgs<ExtArgs>
    blogs?: boolean | user$blogsArgs<ExtArgs>
    comments?: boolean | user$commentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type userSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    avatar_url?: boolean
    cover_url?: boolean
    created_at?: boolean
    deleted_at?: boolean
    email?: boolean
    eth_address?: boolean
    face_prompt?: boolean
    header_image_url?: boolean
    id?: boolean
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: boolean
    metadata?: boolean
    name?: boolean
    password_hash?: boolean
    role?: boolean
    token2fa?: boolean
    updated_at?: boolean
    username?: boolean
    uuid?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    avatar_url?: boolean
    cover_url?: boolean
    created_at?: boolean
    deleted_at?: boolean
    email?: boolean
    eth_address?: boolean
    face_prompt?: boolean
    header_image_url?: boolean
    id?: boolean
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: boolean
    metadata?: boolean
    name?: boolean
    password_hash?: boolean
    role?: boolean
    token2fa?: boolean
    updated_at?: boolean
    username?: boolean
    uuid?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectScalar = {
    avatar_url?: boolean
    cover_url?: boolean
    created_at?: boolean
    deleted_at?: boolean
    email?: boolean
    eth_address?: boolean
    face_prompt?: boolean
    header_image_url?: boolean
    id?: boolean
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: boolean
    metadata?: boolean
    name?: boolean
    password_hash?: boolean
    role?: boolean
    token2fa?: boolean
    updated_at?: boolean
    username?: boolean
    uuid?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"avatar_url" | "cover_url" | "created_at" | "deleted_at" | "email" | "eth_address" | "face_prompt" | "header_image_url" | "id" | "is_active" | "is_2fa_enabled" | "is_email_verified" | "is_eth_address_verified" | "last_login" | "metadata" | "name" | "password_hash" | "role" | "token2fa" | "updated_at" | "username" | "uuid", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tokens?: boolean | user$tokensArgs<ExtArgs>
    blogs?: boolean | user$blogsArgs<ExtArgs>
    comments?: boolean | user$commentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type userIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type userIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      tokens: Prisma.$tokenPayload<ExtArgs>[]
      blogs: Prisma.$blogPayload<ExtArgs>[]
      comments: Prisma.$commentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      avatar_url: string | null
      cover_url: string | null
      created_at: Date
      deleted_at: Date | null
      email: string
      eth_address: string | null
      face_prompt: string | null
      header_image_url: string | null
      id: number
      is_active: boolean
      is_2fa_enabled: boolean
      is_email_verified: boolean
      is_eth_address_verified: boolean
      last_login: Date | null
      metadata: Prisma.JsonValue
      name: string
      password_hash: string | null
      role: $Enums.user_role
      token2fa: string | null
      updated_at: Date
      username: string
      uuid: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `avatar_url`
     * const userWithAvatar_urlOnly = await prisma.user.findMany({ select: { avatar_url: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {userCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `avatar_url`
     * const userWithAvatar_urlOnly = await prisma.user.createManyAndReturn({
     *   select: { avatar_url: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends userCreateManyAndReturnArgs>(args?: SelectSubset<T, userCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {userUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `avatar_url`
     * const userWithAvatar_urlOnly = await prisma.user.updateManyAndReturn({
     *   select: { avatar_url: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends userUpdateManyAndReturnArgs>(args: SelectSubset<T, userUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tokens<T extends user$tokensArgs<ExtArgs> = {}>(args?: Subset<T, user$tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    blogs<T extends user$blogsArgs<ExtArgs> = {}>(args?: Subset<T, user$blogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$blogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends user$commentsArgs<ExtArgs> = {}>(args?: Subset<T, user$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly avatar_url: FieldRef<"user", 'String'>
    readonly cover_url: FieldRef<"user", 'String'>
    readonly created_at: FieldRef<"user", 'DateTime'>
    readonly deleted_at: FieldRef<"user", 'DateTime'>
    readonly email: FieldRef<"user", 'String'>
    readonly eth_address: FieldRef<"user", 'String'>
    readonly face_prompt: FieldRef<"user", 'String'>
    readonly header_image_url: FieldRef<"user", 'String'>
    readonly id: FieldRef<"user", 'Int'>
    readonly is_active: FieldRef<"user", 'Boolean'>
    readonly is_2fa_enabled: FieldRef<"user", 'Boolean'>
    readonly is_email_verified: FieldRef<"user", 'Boolean'>
    readonly is_eth_address_verified: FieldRef<"user", 'Boolean'>
    readonly last_login: FieldRef<"user", 'DateTime'>
    readonly metadata: FieldRef<"user", 'Json'>
    readonly name: FieldRef<"user", 'String'>
    readonly password_hash: FieldRef<"user", 'String'>
    readonly role: FieldRef<"user", 'user_role'>
    readonly token2fa: FieldRef<"user", 'String'>
    readonly updated_at: FieldRef<"user", 'DateTime'>
    readonly username: FieldRef<"user", 'String'>
    readonly uuid: FieldRef<"user", 'String'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user createManyAndReturn
   */
  export type userCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user updateManyAndReturn
   */
  export type userUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.tokens
   */
  export type user$tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the token
     */
    select?: tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the token
     */
    omit?: tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tokenInclude<ExtArgs> | null
    where?: tokenWhereInput
    orderBy?: tokenOrderByWithRelationInput | tokenOrderByWithRelationInput[]
    cursor?: tokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * user.blogs
   */
  export type user$blogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blog
     */
    select?: blogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the blog
     */
    omit?: blogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: blogInclude<ExtArgs> | null
    where?: blogWhereInput
    orderBy?: blogOrderByWithRelationInput | blogOrderByWithRelationInput[]
    cursor?: blogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * user.comments
   */
  export type user$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the comment
     */
    select?: commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the comment
     */
    omit?: commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commentInclude<ExtArgs> | null
    where?: commentWhereInput
    orderBy?: commentOrderByWithRelationInput | commentOrderByWithRelationInput[]
    cursor?: commentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BlogScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    published: 'published',
    author_id: 'author_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type BlogScalarFieldEnum = (typeof BlogScalarFieldEnum)[keyof typeof BlogScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    blog_id: 'blog_id',
    author_id: 'author_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    created_at: 'created_at',
    expires_at: 'expires_at',
    id: 'id',
    metadata: 'metadata',
    token: 'token',
    token_hash: 'token_hash',
    type: 'type',
    updated_at: 'updated_at',
    user_id: 'user_id',
    uuid: 'uuid'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const UserScalarFieldEnum: {
    avatar_url: 'avatar_url',
    cover_url: 'cover_url',
    created_at: 'created_at',
    deleted_at: 'deleted_at',
    email: 'email',
    eth_address: 'eth_address',
    face_prompt: 'face_prompt',
    header_image_url: 'header_image_url',
    id: 'id',
    is_active: 'is_active',
    is_2fa_enabled: 'is_2fa_enabled',
    is_email_verified: 'is_email_verified',
    is_eth_address_verified: 'is_eth_address_verified',
    last_login: 'last_login',
    metadata: 'metadata',
    name: 'name',
    password_hash: 'password_hash',
    role: 'role',
    token2fa: 'token2fa',
    updated_at: 'updated_at',
    username: 'username',
    uuid: 'uuid'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'token_type'
   */
  export type Enumtoken_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'token_type'>
    


  /**
   * Reference to a field of type 'token_type[]'
   */
  export type ListEnumtoken_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'token_type[]'>
    


  /**
   * Reference to a field of type 'user_role'
   */
  export type Enumuser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_role'>
    


  /**
   * Reference to a field of type 'user_role[]'
   */
  export type ListEnumuser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_role[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type blogWhereInput = {
    AND?: blogWhereInput | blogWhereInput[]
    OR?: blogWhereInput[]
    NOT?: blogWhereInput | blogWhereInput[]
    id?: StringFilter<"blog"> | string
    title?: StringFilter<"blog"> | string
    content?: StringFilter<"blog"> | string
    published?: BoolFilter<"blog"> | boolean
    author_id?: IntFilter<"blog"> | number
    created_at?: DateTimeFilter<"blog"> | Date | string
    updated_at?: DateTimeFilter<"blog"> | Date | string
    author?: XOR<UserScalarRelationFilter, userWhereInput>
    comments?: CommentListRelationFilter
  }

  export type blogOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    author?: userOrderByWithRelationInput
    comments?: commentOrderByRelationAggregateInput
  }

  export type blogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: blogWhereInput | blogWhereInput[]
    OR?: blogWhereInput[]
    NOT?: blogWhereInput | blogWhereInput[]
    title?: StringFilter<"blog"> | string
    content?: StringFilter<"blog"> | string
    published?: BoolFilter<"blog"> | boolean
    author_id?: IntFilter<"blog"> | number
    created_at?: DateTimeFilter<"blog"> | Date | string
    updated_at?: DateTimeFilter<"blog"> | Date | string
    author?: XOR<UserScalarRelationFilter, userWhereInput>
    comments?: CommentListRelationFilter
  }, "id">

  export type blogOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: blogCountOrderByAggregateInput
    _avg?: blogAvgOrderByAggregateInput
    _max?: blogMaxOrderByAggregateInput
    _min?: blogMinOrderByAggregateInput
    _sum?: blogSumOrderByAggregateInput
  }

  export type blogScalarWhereWithAggregatesInput = {
    AND?: blogScalarWhereWithAggregatesInput | blogScalarWhereWithAggregatesInput[]
    OR?: blogScalarWhereWithAggregatesInput[]
    NOT?: blogScalarWhereWithAggregatesInput | blogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"blog"> | string
    title?: StringWithAggregatesFilter<"blog"> | string
    content?: StringWithAggregatesFilter<"blog"> | string
    published?: BoolWithAggregatesFilter<"blog"> | boolean
    author_id?: IntWithAggregatesFilter<"blog"> | number
    created_at?: DateTimeWithAggregatesFilter<"blog"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"blog"> | Date | string
  }

  export type commentWhereInput = {
    AND?: commentWhereInput | commentWhereInput[]
    OR?: commentWhereInput[]
    NOT?: commentWhereInput | commentWhereInput[]
    id?: StringFilter<"comment"> | string
    content?: StringFilter<"comment"> | string
    blog_id?: StringFilter<"comment"> | string
    author_id?: IntFilter<"comment"> | number
    created_at?: DateTimeFilter<"comment"> | Date | string
    updated_at?: DateTimeFilter<"comment"> | Date | string
    blog?: XOR<BlogScalarRelationFilter, blogWhereInput>
    author?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type commentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    blog_id?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    blog?: blogOrderByWithRelationInput
    author?: userOrderByWithRelationInput
  }

  export type commentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: commentWhereInput | commentWhereInput[]
    OR?: commentWhereInput[]
    NOT?: commentWhereInput | commentWhereInput[]
    content?: StringFilter<"comment"> | string
    blog_id?: StringFilter<"comment"> | string
    author_id?: IntFilter<"comment"> | number
    created_at?: DateTimeFilter<"comment"> | Date | string
    updated_at?: DateTimeFilter<"comment"> | Date | string
    blog?: XOR<BlogScalarRelationFilter, blogWhereInput>
    author?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id">

  export type commentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    blog_id?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: commentCountOrderByAggregateInput
    _avg?: commentAvgOrderByAggregateInput
    _max?: commentMaxOrderByAggregateInput
    _min?: commentMinOrderByAggregateInput
    _sum?: commentSumOrderByAggregateInput
  }

  export type commentScalarWhereWithAggregatesInput = {
    AND?: commentScalarWhereWithAggregatesInput | commentScalarWhereWithAggregatesInput[]
    OR?: commentScalarWhereWithAggregatesInput[]
    NOT?: commentScalarWhereWithAggregatesInput | commentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"comment"> | string
    content?: StringWithAggregatesFilter<"comment"> | string
    blog_id?: StringWithAggregatesFilter<"comment"> | string
    author_id?: IntWithAggregatesFilter<"comment"> | number
    created_at?: DateTimeWithAggregatesFilter<"comment"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"comment"> | Date | string
  }

  export type tokenWhereInput = {
    AND?: tokenWhereInput | tokenWhereInput[]
    OR?: tokenWhereInput[]
    NOT?: tokenWhereInput | tokenWhereInput[]
    created_at?: DateTimeFilter<"token"> | Date | string
    expires_at?: DateTimeFilter<"token"> | Date | string
    id?: IntFilter<"token"> | number
    metadata?: JsonFilter<"token">
    token?: StringFilter<"token"> | string
    token_hash?: StringFilter<"token"> | string
    type?: Enumtoken_typeFilter<"token"> | $Enums.token_type
    updated_at?: DateTimeFilter<"token"> | Date | string
    user_id?: IntFilter<"token"> | number
    uuid?: StringNullableFilter<"token"> | string | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type tokenOrderByWithRelationInput = {
    created_at?: SortOrder
    expires_at?: SortOrder
    id?: SortOrder
    metadata?: SortOrder
    token?: SortOrder
    token_hash?: SortOrder
    type?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    uuid?: SortOrderInput | SortOrder
    user?: userOrderByWithRelationInput
  }

  export type tokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    token?: string
    uuid?: string
    AND?: tokenWhereInput | tokenWhereInput[]
    OR?: tokenWhereInput[]
    NOT?: tokenWhereInput | tokenWhereInput[]
    created_at?: DateTimeFilter<"token"> | Date | string
    expires_at?: DateTimeFilter<"token"> | Date | string
    metadata?: JsonFilter<"token">
    token_hash?: StringFilter<"token"> | string
    type?: Enumtoken_typeFilter<"token"> | $Enums.token_type
    updated_at?: DateTimeFilter<"token"> | Date | string
    user_id?: IntFilter<"token"> | number
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id" | "token" | "uuid">

  export type tokenOrderByWithAggregationInput = {
    created_at?: SortOrder
    expires_at?: SortOrder
    id?: SortOrder
    metadata?: SortOrder
    token?: SortOrder
    token_hash?: SortOrder
    type?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    uuid?: SortOrderInput | SortOrder
    _count?: tokenCountOrderByAggregateInput
    _avg?: tokenAvgOrderByAggregateInput
    _max?: tokenMaxOrderByAggregateInput
    _min?: tokenMinOrderByAggregateInput
    _sum?: tokenSumOrderByAggregateInput
  }

  export type tokenScalarWhereWithAggregatesInput = {
    AND?: tokenScalarWhereWithAggregatesInput | tokenScalarWhereWithAggregatesInput[]
    OR?: tokenScalarWhereWithAggregatesInput[]
    NOT?: tokenScalarWhereWithAggregatesInput | tokenScalarWhereWithAggregatesInput[]
    created_at?: DateTimeWithAggregatesFilter<"token"> | Date | string
    expires_at?: DateTimeWithAggregatesFilter<"token"> | Date | string
    id?: IntWithAggregatesFilter<"token"> | number
    metadata?: JsonWithAggregatesFilter<"token">
    token?: StringWithAggregatesFilter<"token"> | string
    token_hash?: StringWithAggregatesFilter<"token"> | string
    type?: Enumtoken_typeWithAggregatesFilter<"token"> | $Enums.token_type
    updated_at?: DateTimeWithAggregatesFilter<"token"> | Date | string
    user_id?: IntWithAggregatesFilter<"token"> | number
    uuid?: StringNullableWithAggregatesFilter<"token"> | string | null
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    avatar_url?: StringNullableFilter<"user"> | string | null
    cover_url?: StringNullableFilter<"user"> | string | null
    created_at?: DateTimeFilter<"user"> | Date | string
    deleted_at?: DateTimeNullableFilter<"user"> | Date | string | null
    email?: StringFilter<"user"> | string
    eth_address?: StringNullableFilter<"user"> | string | null
    face_prompt?: StringNullableFilter<"user"> | string | null
    header_image_url?: StringNullableFilter<"user"> | string | null
    id?: IntFilter<"user"> | number
    is_active?: BoolFilter<"user"> | boolean
    is_2fa_enabled?: BoolFilter<"user"> | boolean
    is_email_verified?: BoolFilter<"user"> | boolean
    is_eth_address_verified?: BoolFilter<"user"> | boolean
    last_login?: DateTimeNullableFilter<"user"> | Date | string | null
    metadata?: JsonFilter<"user">
    name?: StringFilter<"user"> | string
    password_hash?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    token2fa?: StringNullableFilter<"user"> | string | null
    updated_at?: DateTimeFilter<"user"> | Date | string
    username?: StringFilter<"user"> | string
    uuid?: StringNullableFilter<"user"> | string | null
    tokens?: TokenListRelationFilter
    blogs?: BlogListRelationFilter
    comments?: CommentListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    avatar_url?: SortOrderInput | SortOrder
    cover_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    email?: SortOrder
    eth_address?: SortOrderInput | SortOrder
    face_prompt?: SortOrderInput | SortOrder
    header_image_url?: SortOrderInput | SortOrder
    id?: SortOrder
    is_active?: SortOrder
    is_2fa_enabled?: SortOrder
    is_email_verified?: SortOrder
    is_eth_address_verified?: SortOrder
    last_login?: SortOrderInput | SortOrder
    metadata?: SortOrder
    name?: SortOrder
    password_hash?: SortOrderInput | SortOrder
    role?: SortOrder
    token2fa?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    username?: SortOrder
    uuid?: SortOrderInput | SortOrder
    tokens?: tokenOrderByRelationAggregateInput
    blogs?: blogOrderByRelationAggregateInput
    comments?: commentOrderByRelationAggregateInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    email?: string
    id?: number
    username?: string
    uuid?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    avatar_url?: StringNullableFilter<"user"> | string | null
    cover_url?: StringNullableFilter<"user"> | string | null
    created_at?: DateTimeFilter<"user"> | Date | string
    deleted_at?: DateTimeNullableFilter<"user"> | Date | string | null
    eth_address?: StringNullableFilter<"user"> | string | null
    face_prompt?: StringNullableFilter<"user"> | string | null
    header_image_url?: StringNullableFilter<"user"> | string | null
    is_active?: BoolFilter<"user"> | boolean
    is_2fa_enabled?: BoolFilter<"user"> | boolean
    is_email_verified?: BoolFilter<"user"> | boolean
    is_eth_address_verified?: BoolFilter<"user"> | boolean
    last_login?: DateTimeNullableFilter<"user"> | Date | string | null
    metadata?: JsonFilter<"user">
    name?: StringFilter<"user"> | string
    password_hash?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    token2fa?: StringNullableFilter<"user"> | string | null
    updated_at?: DateTimeFilter<"user"> | Date | string
    tokens?: TokenListRelationFilter
    blogs?: BlogListRelationFilter
    comments?: CommentListRelationFilter
  }, "id" | "email" | "username" | "uuid">

  export type userOrderByWithAggregationInput = {
    avatar_url?: SortOrderInput | SortOrder
    cover_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    email?: SortOrder
    eth_address?: SortOrderInput | SortOrder
    face_prompt?: SortOrderInput | SortOrder
    header_image_url?: SortOrderInput | SortOrder
    id?: SortOrder
    is_active?: SortOrder
    is_2fa_enabled?: SortOrder
    is_email_verified?: SortOrder
    is_eth_address_verified?: SortOrder
    last_login?: SortOrderInput | SortOrder
    metadata?: SortOrder
    name?: SortOrder
    password_hash?: SortOrderInput | SortOrder
    role?: SortOrder
    token2fa?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    username?: SortOrder
    uuid?: SortOrderInput | SortOrder
    _count?: userCountOrderByAggregateInput
    _avg?: userAvgOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
    _sum?: userSumOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    avatar_url?: StringNullableWithAggregatesFilter<"user"> | string | null
    cover_url?: StringNullableWithAggregatesFilter<"user"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"user"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"user"> | Date | string | null
    email?: StringWithAggregatesFilter<"user"> | string
    eth_address?: StringNullableWithAggregatesFilter<"user"> | string | null
    face_prompt?: StringNullableWithAggregatesFilter<"user"> | string | null
    header_image_url?: StringNullableWithAggregatesFilter<"user"> | string | null
    id?: IntWithAggregatesFilter<"user"> | number
    is_active?: BoolWithAggregatesFilter<"user"> | boolean
    is_2fa_enabled?: BoolWithAggregatesFilter<"user"> | boolean
    is_email_verified?: BoolWithAggregatesFilter<"user"> | boolean
    is_eth_address_verified?: BoolWithAggregatesFilter<"user"> | boolean
    last_login?: DateTimeNullableWithAggregatesFilter<"user"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"user">
    name?: StringWithAggregatesFilter<"user"> | string
    password_hash?: StringNullableWithAggregatesFilter<"user"> | string | null
    role?: Enumuser_roleWithAggregatesFilter<"user"> | $Enums.user_role
    token2fa?: StringNullableWithAggregatesFilter<"user"> | string | null
    updated_at?: DateTimeWithAggregatesFilter<"user"> | Date | string
    username?: StringWithAggregatesFilter<"user"> | string
    uuid?: StringNullableWithAggregatesFilter<"user"> | string | null
  }

  export type blogCreateInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    author: userCreateNestedOneWithoutBlogsInput
    comments?: commentCreateNestedManyWithoutBlogInput
  }

  export type blogUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
    comments?: commentUncheckedCreateNestedManyWithoutBlogInput
  }

  export type blogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: userUpdateOneRequiredWithoutBlogsNestedInput
    comments?: commentUpdateManyWithoutBlogNestedInput
  }

  export type blogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: commentUncheckedUpdateManyWithoutBlogNestedInput
  }

  export type blogCreateManyInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type blogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type blogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentCreateInput = {
    id?: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
    blog: blogCreateNestedOneWithoutCommentsInput
    author: userCreateNestedOneWithoutCommentsInput
  }

  export type commentUncheckedCreateInput = {
    id?: string
    content: string
    blog_id: string
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    blog?: blogUpdateOneRequiredWithoutCommentsNestedInput
    author?: userUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type commentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    blog_id?: StringFieldUpdateOperationsInput | string
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentCreateManyInput = {
    id?: string
    content: string
    blog_id: string
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    blog_id?: StringFieldUpdateOperationsInput | string
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tokenCreateInput = {
    created_at?: Date | string
    expires_at: Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    uuid?: string | null
    user: userCreateNestedOneWithoutTokensInput
  }

  export type tokenUncheckedCreateInput = {
    created_at?: Date | string
    expires_at: Date | string
    id?: number
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    user_id: number
    uuid?: string | null
  }

  export type tokenUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    user?: userUpdateOneRequiredWithoutTokensNestedInput
  }

  export type tokenUncheckedUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tokenCreateManyInput = {
    created_at?: Date | string
    expires_at: Date | string
    id?: number
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    user_id: number
    uuid?: string | null
  }

  export type tokenUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tokenUncheckedUpdateManyInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type userCreateInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenCreateNestedManyWithoutUserInput
    blogs?: blogCreateNestedManyWithoutAuthorInput
    comments?: commentCreateNestedManyWithoutAuthorInput
  }

  export type userUncheckedCreateInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    id?: number
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenUncheckedCreateNestedManyWithoutUserInput
    blogs?: blogUncheckedCreateNestedManyWithoutAuthorInput
    comments?: commentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type userUpdateInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUpdateManyWithoutUserNestedInput
    blogs?: blogUpdateManyWithoutAuthorNestedInput
    comments?: commentUpdateManyWithoutAuthorNestedInput
  }

  export type userUncheckedUpdateInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUncheckedUpdateManyWithoutUserNestedInput
    blogs?: blogUncheckedUpdateManyWithoutAuthorNestedInput
    comments?: commentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type userCreateManyInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    id?: number
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
  }

  export type userUpdateManyMutationInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type userUncheckedUpdateManyInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type CommentListRelationFilter = {
    every?: commentWhereInput
    some?: commentWhereInput
    none?: commentWhereInput
  }

  export type commentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type blogCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type blogAvgOrderByAggregateInput = {
    author_id?: SortOrder
  }

  export type blogMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type blogMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type blogSumOrderByAggregateInput = {
    author_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BlogScalarRelationFilter = {
    is?: blogWhereInput
    isNot?: blogWhereInput
  }

  export type commentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    blog_id?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type commentAvgOrderByAggregateInput = {
    author_id?: SortOrder
  }

  export type commentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    blog_id?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type commentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    blog_id?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type commentSumOrderByAggregateInput = {
    author_id?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type Enumtoken_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.token_type | Enumtoken_typeFieldRefInput<$PrismaModel>
    in?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumtoken_typeFilter<$PrismaModel> | $Enums.token_type
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type tokenCountOrderByAggregateInput = {
    created_at?: SortOrder
    expires_at?: SortOrder
    id?: SortOrder
    metadata?: SortOrder
    token?: SortOrder
    token_hash?: SortOrder
    type?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    uuid?: SortOrder
  }

  export type tokenAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
  }

  export type tokenMaxOrderByAggregateInput = {
    created_at?: SortOrder
    expires_at?: SortOrder
    id?: SortOrder
    token?: SortOrder
    token_hash?: SortOrder
    type?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    uuid?: SortOrder
  }

  export type tokenMinOrderByAggregateInput = {
    created_at?: SortOrder
    expires_at?: SortOrder
    id?: SortOrder
    token?: SortOrder
    token_hash?: SortOrder
    type?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    uuid?: SortOrder
  }

  export type tokenSumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type Enumtoken_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.token_type | Enumtoken_typeFieldRefInput<$PrismaModel>
    in?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumtoken_typeWithAggregatesFilter<$PrismaModel> | $Enums.token_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtoken_typeFilter<$PrismaModel>
    _max?: NestedEnumtoken_typeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Enumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type TokenListRelationFilter = {
    every?: tokenWhereInput
    some?: tokenWhereInput
    none?: tokenWhereInput
  }

  export type BlogListRelationFilter = {
    every?: blogWhereInput
    some?: blogWhereInput
    none?: blogWhereInput
  }

  export type tokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type blogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type userCountOrderByAggregateInput = {
    avatar_url?: SortOrder
    cover_url?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
    email?: SortOrder
    eth_address?: SortOrder
    face_prompt?: SortOrder
    header_image_url?: SortOrder
    id?: SortOrder
    is_active?: SortOrder
    is_2fa_enabled?: SortOrder
    is_email_verified?: SortOrder
    is_eth_address_verified?: SortOrder
    last_login?: SortOrder
    metadata?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    token2fa?: SortOrder
    updated_at?: SortOrder
    username?: SortOrder
    uuid?: SortOrder
  }

  export type userAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    avatar_url?: SortOrder
    cover_url?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
    email?: SortOrder
    eth_address?: SortOrder
    face_prompt?: SortOrder
    header_image_url?: SortOrder
    id?: SortOrder
    is_active?: SortOrder
    is_2fa_enabled?: SortOrder
    is_email_verified?: SortOrder
    is_eth_address_verified?: SortOrder
    last_login?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    token2fa?: SortOrder
    updated_at?: SortOrder
    username?: SortOrder
    uuid?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    avatar_url?: SortOrder
    cover_url?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
    email?: SortOrder
    eth_address?: SortOrder
    face_prompt?: SortOrder
    header_image_url?: SortOrder
    id?: SortOrder
    is_active?: SortOrder
    is_2fa_enabled?: SortOrder
    is_email_verified?: SortOrder
    is_eth_address_verified?: SortOrder
    last_login?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    token2fa?: SortOrder
    updated_at?: SortOrder
    username?: SortOrder
    uuid?: SortOrder
  }

  export type userSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Enumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type userCreateNestedOneWithoutBlogsInput = {
    create?: XOR<userCreateWithoutBlogsInput, userUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: userCreateOrConnectWithoutBlogsInput
    connect?: userWhereUniqueInput
  }

  export type commentCreateNestedManyWithoutBlogInput = {
    create?: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput> | commentCreateWithoutBlogInput[] | commentUncheckedCreateWithoutBlogInput[]
    connectOrCreate?: commentCreateOrConnectWithoutBlogInput | commentCreateOrConnectWithoutBlogInput[]
    createMany?: commentCreateManyBlogInputEnvelope
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
  }

  export type commentUncheckedCreateNestedManyWithoutBlogInput = {
    create?: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput> | commentCreateWithoutBlogInput[] | commentUncheckedCreateWithoutBlogInput[]
    connectOrCreate?: commentCreateOrConnectWithoutBlogInput | commentCreateOrConnectWithoutBlogInput[]
    createMany?: commentCreateManyBlogInputEnvelope
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type userUpdateOneRequiredWithoutBlogsNestedInput = {
    create?: XOR<userCreateWithoutBlogsInput, userUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: userCreateOrConnectWithoutBlogsInput
    upsert?: userUpsertWithoutBlogsInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutBlogsInput, userUpdateWithoutBlogsInput>, userUncheckedUpdateWithoutBlogsInput>
  }

  export type commentUpdateManyWithoutBlogNestedInput = {
    create?: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput> | commentCreateWithoutBlogInput[] | commentUncheckedCreateWithoutBlogInput[]
    connectOrCreate?: commentCreateOrConnectWithoutBlogInput | commentCreateOrConnectWithoutBlogInput[]
    upsert?: commentUpsertWithWhereUniqueWithoutBlogInput | commentUpsertWithWhereUniqueWithoutBlogInput[]
    createMany?: commentCreateManyBlogInputEnvelope
    set?: commentWhereUniqueInput | commentWhereUniqueInput[]
    disconnect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    delete?: commentWhereUniqueInput | commentWhereUniqueInput[]
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    update?: commentUpdateWithWhereUniqueWithoutBlogInput | commentUpdateWithWhereUniqueWithoutBlogInput[]
    updateMany?: commentUpdateManyWithWhereWithoutBlogInput | commentUpdateManyWithWhereWithoutBlogInput[]
    deleteMany?: commentScalarWhereInput | commentScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type commentUncheckedUpdateManyWithoutBlogNestedInput = {
    create?: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput> | commentCreateWithoutBlogInput[] | commentUncheckedCreateWithoutBlogInput[]
    connectOrCreate?: commentCreateOrConnectWithoutBlogInput | commentCreateOrConnectWithoutBlogInput[]
    upsert?: commentUpsertWithWhereUniqueWithoutBlogInput | commentUpsertWithWhereUniqueWithoutBlogInput[]
    createMany?: commentCreateManyBlogInputEnvelope
    set?: commentWhereUniqueInput | commentWhereUniqueInput[]
    disconnect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    delete?: commentWhereUniqueInput | commentWhereUniqueInput[]
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    update?: commentUpdateWithWhereUniqueWithoutBlogInput | commentUpdateWithWhereUniqueWithoutBlogInput[]
    updateMany?: commentUpdateManyWithWhereWithoutBlogInput | commentUpdateManyWithWhereWithoutBlogInput[]
    deleteMany?: commentScalarWhereInput | commentScalarWhereInput[]
  }

  export type blogCreateNestedOneWithoutCommentsInput = {
    create?: XOR<blogCreateWithoutCommentsInput, blogUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: blogCreateOrConnectWithoutCommentsInput
    connect?: blogWhereUniqueInput
  }

  export type userCreateNestedOneWithoutCommentsInput = {
    create?: XOR<userCreateWithoutCommentsInput, userUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: userCreateOrConnectWithoutCommentsInput
    connect?: userWhereUniqueInput
  }

  export type blogUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<blogCreateWithoutCommentsInput, blogUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: blogCreateOrConnectWithoutCommentsInput
    upsert?: blogUpsertWithoutCommentsInput
    connect?: blogWhereUniqueInput
    update?: XOR<XOR<blogUpdateToOneWithWhereWithoutCommentsInput, blogUpdateWithoutCommentsInput>, blogUncheckedUpdateWithoutCommentsInput>
  }

  export type userUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<userCreateWithoutCommentsInput, userUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: userCreateOrConnectWithoutCommentsInput
    upsert?: userUpsertWithoutCommentsInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutCommentsInput, userUpdateWithoutCommentsInput>, userUncheckedUpdateWithoutCommentsInput>
  }

  export type userCreateNestedOneWithoutTokensInput = {
    create?: XOR<userCreateWithoutTokensInput, userUncheckedCreateWithoutTokensInput>
    connectOrCreate?: userCreateOrConnectWithoutTokensInput
    connect?: userWhereUniqueInput
  }

  export type Enumtoken_typeFieldUpdateOperationsInput = {
    set?: $Enums.token_type
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type userUpdateOneRequiredWithoutTokensNestedInput = {
    create?: XOR<userCreateWithoutTokensInput, userUncheckedCreateWithoutTokensInput>
    connectOrCreate?: userCreateOrConnectWithoutTokensInput
    upsert?: userUpsertWithoutTokensInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutTokensInput, userUpdateWithoutTokensInput>, userUncheckedUpdateWithoutTokensInput>
  }

  export type tokenCreateNestedManyWithoutUserInput = {
    create?: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput> | tokenCreateWithoutUserInput[] | tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: tokenCreateOrConnectWithoutUserInput | tokenCreateOrConnectWithoutUserInput[]
    createMany?: tokenCreateManyUserInputEnvelope
    connect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
  }

  export type blogCreateNestedManyWithoutAuthorInput = {
    create?: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput> | blogCreateWithoutAuthorInput[] | blogUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: blogCreateOrConnectWithoutAuthorInput | blogCreateOrConnectWithoutAuthorInput[]
    createMany?: blogCreateManyAuthorInputEnvelope
    connect?: blogWhereUniqueInput | blogWhereUniqueInput[]
  }

  export type commentCreateNestedManyWithoutAuthorInput = {
    create?: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput> | commentCreateWithoutAuthorInput[] | commentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: commentCreateOrConnectWithoutAuthorInput | commentCreateOrConnectWithoutAuthorInput[]
    createMany?: commentCreateManyAuthorInputEnvelope
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
  }

  export type tokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput> | tokenCreateWithoutUserInput[] | tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: tokenCreateOrConnectWithoutUserInput | tokenCreateOrConnectWithoutUserInput[]
    createMany?: tokenCreateManyUserInputEnvelope
    connect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
  }

  export type blogUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput> | blogCreateWithoutAuthorInput[] | blogUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: blogCreateOrConnectWithoutAuthorInput | blogCreateOrConnectWithoutAuthorInput[]
    createMany?: blogCreateManyAuthorInputEnvelope
    connect?: blogWhereUniqueInput | blogWhereUniqueInput[]
  }

  export type commentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput> | commentCreateWithoutAuthorInput[] | commentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: commentCreateOrConnectWithoutAuthorInput | commentCreateOrConnectWithoutAuthorInput[]
    createMany?: commentCreateManyAuthorInputEnvelope
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type Enumuser_roleFieldUpdateOperationsInput = {
    set?: $Enums.user_role
  }

  export type tokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput> | tokenCreateWithoutUserInput[] | tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: tokenCreateOrConnectWithoutUserInput | tokenCreateOrConnectWithoutUserInput[]
    upsert?: tokenUpsertWithWhereUniqueWithoutUserInput | tokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: tokenCreateManyUserInputEnvelope
    set?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    disconnect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    delete?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    connect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    update?: tokenUpdateWithWhereUniqueWithoutUserInput | tokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: tokenUpdateManyWithWhereWithoutUserInput | tokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: tokenScalarWhereInput | tokenScalarWhereInput[]
  }

  export type blogUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput> | blogCreateWithoutAuthorInput[] | blogUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: blogCreateOrConnectWithoutAuthorInput | blogCreateOrConnectWithoutAuthorInput[]
    upsert?: blogUpsertWithWhereUniqueWithoutAuthorInput | blogUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: blogCreateManyAuthorInputEnvelope
    set?: blogWhereUniqueInput | blogWhereUniqueInput[]
    disconnect?: blogWhereUniqueInput | blogWhereUniqueInput[]
    delete?: blogWhereUniqueInput | blogWhereUniqueInput[]
    connect?: blogWhereUniqueInput | blogWhereUniqueInput[]
    update?: blogUpdateWithWhereUniqueWithoutAuthorInput | blogUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: blogUpdateManyWithWhereWithoutAuthorInput | blogUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: blogScalarWhereInput | blogScalarWhereInput[]
  }

  export type commentUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput> | commentCreateWithoutAuthorInput[] | commentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: commentCreateOrConnectWithoutAuthorInput | commentCreateOrConnectWithoutAuthorInput[]
    upsert?: commentUpsertWithWhereUniqueWithoutAuthorInput | commentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: commentCreateManyAuthorInputEnvelope
    set?: commentWhereUniqueInput | commentWhereUniqueInput[]
    disconnect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    delete?: commentWhereUniqueInput | commentWhereUniqueInput[]
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    update?: commentUpdateWithWhereUniqueWithoutAuthorInput | commentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: commentUpdateManyWithWhereWithoutAuthorInput | commentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: commentScalarWhereInput | commentScalarWhereInput[]
  }

  export type tokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput> | tokenCreateWithoutUserInput[] | tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: tokenCreateOrConnectWithoutUserInput | tokenCreateOrConnectWithoutUserInput[]
    upsert?: tokenUpsertWithWhereUniqueWithoutUserInput | tokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: tokenCreateManyUserInputEnvelope
    set?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    disconnect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    delete?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    connect?: tokenWhereUniqueInput | tokenWhereUniqueInput[]
    update?: tokenUpdateWithWhereUniqueWithoutUserInput | tokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: tokenUpdateManyWithWhereWithoutUserInput | tokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: tokenScalarWhereInput | tokenScalarWhereInput[]
  }

  export type blogUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput> | blogCreateWithoutAuthorInput[] | blogUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: blogCreateOrConnectWithoutAuthorInput | blogCreateOrConnectWithoutAuthorInput[]
    upsert?: blogUpsertWithWhereUniqueWithoutAuthorInput | blogUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: blogCreateManyAuthorInputEnvelope
    set?: blogWhereUniqueInput | blogWhereUniqueInput[]
    disconnect?: blogWhereUniqueInput | blogWhereUniqueInput[]
    delete?: blogWhereUniqueInput | blogWhereUniqueInput[]
    connect?: blogWhereUniqueInput | blogWhereUniqueInput[]
    update?: blogUpdateWithWhereUniqueWithoutAuthorInput | blogUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: blogUpdateManyWithWhereWithoutAuthorInput | blogUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: blogScalarWhereInput | blogScalarWhereInput[]
  }

  export type commentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput> | commentCreateWithoutAuthorInput[] | commentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: commentCreateOrConnectWithoutAuthorInput | commentCreateOrConnectWithoutAuthorInput[]
    upsert?: commentUpsertWithWhereUniqueWithoutAuthorInput | commentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: commentCreateManyAuthorInputEnvelope
    set?: commentWhereUniqueInput | commentWhereUniqueInput[]
    disconnect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    delete?: commentWhereUniqueInput | commentWhereUniqueInput[]
    connect?: commentWhereUniqueInput | commentWhereUniqueInput[]
    update?: commentUpdateWithWhereUniqueWithoutAuthorInput | commentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: commentUpdateManyWithWhereWithoutAuthorInput | commentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: commentScalarWhereInput | commentScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumtoken_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.token_type | Enumtoken_typeFieldRefInput<$PrismaModel>
    in?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumtoken_typeFilter<$PrismaModel> | $Enums.token_type
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumtoken_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.token_type | Enumtoken_typeFieldRefInput<$PrismaModel>
    in?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.token_type[] | ListEnumtoken_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumtoken_typeWithAggregatesFilter<$PrismaModel> | $Enums.token_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtoken_typeFilter<$PrismaModel>
    _max?: NestedEnumtoken_typeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.user_role[] | ListEnumuser_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type userCreateWithoutBlogsInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenCreateNestedManyWithoutUserInput
    comments?: commentCreateNestedManyWithoutAuthorInput
  }

  export type userUncheckedCreateWithoutBlogsInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    id?: number
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenUncheckedCreateNestedManyWithoutUserInput
    comments?: commentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type userCreateOrConnectWithoutBlogsInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutBlogsInput, userUncheckedCreateWithoutBlogsInput>
  }

  export type commentCreateWithoutBlogInput = {
    id?: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
    author: userCreateNestedOneWithoutCommentsInput
  }

  export type commentUncheckedCreateWithoutBlogInput = {
    id?: string
    content: string
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentCreateOrConnectWithoutBlogInput = {
    where: commentWhereUniqueInput
    create: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput>
  }

  export type commentCreateManyBlogInputEnvelope = {
    data: commentCreateManyBlogInput | commentCreateManyBlogInput[]
    skipDuplicates?: boolean
  }

  export type userUpsertWithoutBlogsInput = {
    update: XOR<userUpdateWithoutBlogsInput, userUncheckedUpdateWithoutBlogsInput>
    create: XOR<userCreateWithoutBlogsInput, userUncheckedCreateWithoutBlogsInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutBlogsInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutBlogsInput, userUncheckedUpdateWithoutBlogsInput>
  }

  export type userUpdateWithoutBlogsInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUpdateManyWithoutUserNestedInput
    comments?: commentUpdateManyWithoutAuthorNestedInput
  }

  export type userUncheckedUpdateWithoutBlogsInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUncheckedUpdateManyWithoutUserNestedInput
    comments?: commentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type commentUpsertWithWhereUniqueWithoutBlogInput = {
    where: commentWhereUniqueInput
    update: XOR<commentUpdateWithoutBlogInput, commentUncheckedUpdateWithoutBlogInput>
    create: XOR<commentCreateWithoutBlogInput, commentUncheckedCreateWithoutBlogInput>
  }

  export type commentUpdateWithWhereUniqueWithoutBlogInput = {
    where: commentWhereUniqueInput
    data: XOR<commentUpdateWithoutBlogInput, commentUncheckedUpdateWithoutBlogInput>
  }

  export type commentUpdateManyWithWhereWithoutBlogInput = {
    where: commentScalarWhereInput
    data: XOR<commentUpdateManyMutationInput, commentUncheckedUpdateManyWithoutBlogInput>
  }

  export type commentScalarWhereInput = {
    AND?: commentScalarWhereInput | commentScalarWhereInput[]
    OR?: commentScalarWhereInput[]
    NOT?: commentScalarWhereInput | commentScalarWhereInput[]
    id?: StringFilter<"comment"> | string
    content?: StringFilter<"comment"> | string
    blog_id?: StringFilter<"comment"> | string
    author_id?: IntFilter<"comment"> | number
    created_at?: DateTimeFilter<"comment"> | Date | string
    updated_at?: DateTimeFilter<"comment"> | Date | string
  }

  export type blogCreateWithoutCommentsInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    author: userCreateNestedOneWithoutBlogsInput
  }

  export type blogUncheckedCreateWithoutCommentsInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type blogCreateOrConnectWithoutCommentsInput = {
    where: blogWhereUniqueInput
    create: XOR<blogCreateWithoutCommentsInput, blogUncheckedCreateWithoutCommentsInput>
  }

  export type userCreateWithoutCommentsInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenCreateNestedManyWithoutUserInput
    blogs?: blogCreateNestedManyWithoutAuthorInput
  }

  export type userUncheckedCreateWithoutCommentsInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    id?: number
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    tokens?: tokenUncheckedCreateNestedManyWithoutUserInput
    blogs?: blogUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type userCreateOrConnectWithoutCommentsInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutCommentsInput, userUncheckedCreateWithoutCommentsInput>
  }

  export type blogUpsertWithoutCommentsInput = {
    update: XOR<blogUpdateWithoutCommentsInput, blogUncheckedUpdateWithoutCommentsInput>
    create: XOR<blogCreateWithoutCommentsInput, blogUncheckedCreateWithoutCommentsInput>
    where?: blogWhereInput
  }

  export type blogUpdateToOneWithWhereWithoutCommentsInput = {
    where?: blogWhereInput
    data: XOR<blogUpdateWithoutCommentsInput, blogUncheckedUpdateWithoutCommentsInput>
  }

  export type blogUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: userUpdateOneRequiredWithoutBlogsNestedInput
  }

  export type blogUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUpsertWithoutCommentsInput = {
    update: XOR<userUpdateWithoutCommentsInput, userUncheckedUpdateWithoutCommentsInput>
    create: XOR<userCreateWithoutCommentsInput, userUncheckedCreateWithoutCommentsInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutCommentsInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutCommentsInput, userUncheckedUpdateWithoutCommentsInput>
  }

  export type userUpdateWithoutCommentsInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUpdateManyWithoutUserNestedInput
    blogs?: blogUpdateManyWithoutAuthorNestedInput
  }

  export type userUncheckedUpdateWithoutCommentsInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    tokens?: tokenUncheckedUpdateManyWithoutUserNestedInput
    blogs?: blogUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type userCreateWithoutTokensInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    blogs?: blogCreateNestedManyWithoutAuthorInput
    comments?: commentCreateNestedManyWithoutAuthorInput
  }

  export type userUncheckedCreateWithoutTokensInput = {
    avatar_url?: string | null
    cover_url?: string | null
    created_at?: Date | string
    deleted_at?: Date | string | null
    email: string
    eth_address?: string | null
    face_prompt?: string | null
    header_image_url?: string | null
    id?: number
    is_active?: boolean
    is_2fa_enabled?: boolean
    is_email_verified?: boolean
    is_eth_address_verified?: boolean
    last_login?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name: string
    password_hash?: string | null
    role?: $Enums.user_role
    token2fa?: string | null
    updated_at?: Date | string
    username: string
    uuid?: string | null
    blogs?: blogUncheckedCreateNestedManyWithoutAuthorInput
    comments?: commentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type userCreateOrConnectWithoutTokensInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutTokensInput, userUncheckedCreateWithoutTokensInput>
  }

  export type userUpsertWithoutTokensInput = {
    update: XOR<userUpdateWithoutTokensInput, userUncheckedUpdateWithoutTokensInput>
    create: XOR<userCreateWithoutTokensInput, userUncheckedCreateWithoutTokensInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutTokensInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutTokensInput, userUncheckedUpdateWithoutTokensInput>
  }

  export type userUpdateWithoutTokensInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    blogs?: blogUpdateManyWithoutAuthorNestedInput
    comments?: commentUpdateManyWithoutAuthorNestedInput
  }

  export type userUncheckedUpdateWithoutTokensInput = {
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    eth_address?: NullableStringFieldUpdateOperationsInput | string | null
    face_prompt?: NullableStringFieldUpdateOperationsInput | string | null
    header_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_2fa_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_email_verified?: BoolFieldUpdateOperationsInput | boolean
    is_eth_address_verified?: BoolFieldUpdateOperationsInput | boolean
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    token2fa?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
    blogs?: blogUncheckedUpdateManyWithoutAuthorNestedInput
    comments?: commentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type tokenCreateWithoutUserInput = {
    created_at?: Date | string
    expires_at: Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    uuid?: string | null
  }

  export type tokenUncheckedCreateWithoutUserInput = {
    created_at?: Date | string
    expires_at: Date | string
    id?: number
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    uuid?: string | null
  }

  export type tokenCreateOrConnectWithoutUserInput = {
    where: tokenWhereUniqueInput
    create: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput>
  }

  export type tokenCreateManyUserInputEnvelope = {
    data: tokenCreateManyUserInput | tokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type blogCreateWithoutAuthorInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    comments?: commentCreateNestedManyWithoutBlogInput
  }

  export type blogUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    comments?: commentUncheckedCreateNestedManyWithoutBlogInput
  }

  export type blogCreateOrConnectWithoutAuthorInput = {
    where: blogWhereUniqueInput
    create: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput>
  }

  export type blogCreateManyAuthorInputEnvelope = {
    data: blogCreateManyAuthorInput | blogCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type commentCreateWithoutAuthorInput = {
    id?: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
    blog: blogCreateNestedOneWithoutCommentsInput
  }

  export type commentUncheckedCreateWithoutAuthorInput = {
    id?: string
    content: string
    blog_id: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentCreateOrConnectWithoutAuthorInput = {
    where: commentWhereUniqueInput
    create: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput>
  }

  export type commentCreateManyAuthorInputEnvelope = {
    data: commentCreateManyAuthorInput | commentCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type tokenUpsertWithWhereUniqueWithoutUserInput = {
    where: tokenWhereUniqueInput
    update: XOR<tokenUpdateWithoutUserInput, tokenUncheckedUpdateWithoutUserInput>
    create: XOR<tokenCreateWithoutUserInput, tokenUncheckedCreateWithoutUserInput>
  }

  export type tokenUpdateWithWhereUniqueWithoutUserInput = {
    where: tokenWhereUniqueInput
    data: XOR<tokenUpdateWithoutUserInput, tokenUncheckedUpdateWithoutUserInput>
  }

  export type tokenUpdateManyWithWhereWithoutUserInput = {
    where: tokenScalarWhereInput
    data: XOR<tokenUpdateManyMutationInput, tokenUncheckedUpdateManyWithoutUserInput>
  }

  export type tokenScalarWhereInput = {
    AND?: tokenScalarWhereInput | tokenScalarWhereInput[]
    OR?: tokenScalarWhereInput[]
    NOT?: tokenScalarWhereInput | tokenScalarWhereInput[]
    created_at?: DateTimeFilter<"token"> | Date | string
    expires_at?: DateTimeFilter<"token"> | Date | string
    id?: IntFilter<"token"> | number
    metadata?: JsonFilter<"token">
    token?: StringFilter<"token"> | string
    token_hash?: StringFilter<"token"> | string
    type?: Enumtoken_typeFilter<"token"> | $Enums.token_type
    updated_at?: DateTimeFilter<"token"> | Date | string
    user_id?: IntFilter<"token"> | number
    uuid?: StringNullableFilter<"token"> | string | null
  }

  export type blogUpsertWithWhereUniqueWithoutAuthorInput = {
    where: blogWhereUniqueInput
    update: XOR<blogUpdateWithoutAuthorInput, blogUncheckedUpdateWithoutAuthorInput>
    create: XOR<blogCreateWithoutAuthorInput, blogUncheckedCreateWithoutAuthorInput>
  }

  export type blogUpdateWithWhereUniqueWithoutAuthorInput = {
    where: blogWhereUniqueInput
    data: XOR<blogUpdateWithoutAuthorInput, blogUncheckedUpdateWithoutAuthorInput>
  }

  export type blogUpdateManyWithWhereWithoutAuthorInput = {
    where: blogScalarWhereInput
    data: XOR<blogUpdateManyMutationInput, blogUncheckedUpdateManyWithoutAuthorInput>
  }

  export type blogScalarWhereInput = {
    AND?: blogScalarWhereInput | blogScalarWhereInput[]
    OR?: blogScalarWhereInput[]
    NOT?: blogScalarWhereInput | blogScalarWhereInput[]
    id?: StringFilter<"blog"> | string
    title?: StringFilter<"blog"> | string
    content?: StringFilter<"blog"> | string
    published?: BoolFilter<"blog"> | boolean
    author_id?: IntFilter<"blog"> | number
    created_at?: DateTimeFilter<"blog"> | Date | string
    updated_at?: DateTimeFilter<"blog"> | Date | string
  }

  export type commentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: commentWhereUniqueInput
    update: XOR<commentUpdateWithoutAuthorInput, commentUncheckedUpdateWithoutAuthorInput>
    create: XOR<commentCreateWithoutAuthorInput, commentUncheckedCreateWithoutAuthorInput>
  }

  export type commentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: commentWhereUniqueInput
    data: XOR<commentUpdateWithoutAuthorInput, commentUncheckedUpdateWithoutAuthorInput>
  }

  export type commentUpdateManyWithWhereWithoutAuthorInput = {
    where: commentScalarWhereInput
    data: XOR<commentUpdateManyMutationInput, commentUncheckedUpdateManyWithoutAuthorInput>
  }

  export type commentCreateManyBlogInput = {
    id?: string
    content: string
    author_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentUpdateWithoutBlogInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: userUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type commentUncheckedUpdateWithoutBlogInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentUncheckedUpdateManyWithoutBlogInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    author_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tokenCreateManyUserInput = {
    created_at?: Date | string
    expires_at: Date | string
    id?: number
    metadata?: JsonNullValueInput | InputJsonValue
    token: string
    token_hash: string
    type: $Enums.token_type
    updated_at?: Date | string
    uuid?: string | null
  }

  export type blogCreateManyAuthorInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type commentCreateManyAuthorInput = {
    id?: string
    content: string
    blog_id: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type tokenUpdateWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tokenUncheckedUpdateWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tokenUncheckedUpdateManyWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    token?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    type?: Enumtoken_typeFieldUpdateOperationsInput | $Enums.token_type
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uuid?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type blogUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: commentUpdateManyWithoutBlogNestedInput
  }

  export type blogUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: commentUncheckedUpdateManyWithoutBlogNestedInput
  }

  export type blogUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    blog?: blogUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type commentUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    blog_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commentUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    blog_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}