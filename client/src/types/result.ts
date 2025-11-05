/**
 * Represents a successful operation result containing a non-null value.
 *
 * @template T - The type of the successful value.
 *
 * @property {true} ok - A constant flag that indicates the operation was successful.
 * @property {NonNullable<T>} value - The non-null result value returned by the operation.
 *
 * @example
 * ```ts
 * const success = Result.ok("User created");
 * if (success.ok) {
 *   console.log(success.value); // "User created"
 * }
 * ```
 *
 * @remarks
 * This type enforces non-null success values to reduce null-handling overhead
 * and improve type safety when working with predictable success results.
 */
export type Success<T> = {
    ok: true;
    value: NonNullable<T>;
};


/**
 * Represents a failed operation result containing a non-null error.
 *
 * @template E - The type of the error. Must extend the `Error` class for consistent error semantics.
 *
 * @property {false} ok - A constant flag that indicates the operation failed.
 * @property {NonNullable<E>} error - The non-null error describing the reason for failure.
 *
 * @example
 * ```ts
 * const failure = Result.error(new Error("Network unreachable"));
 * if (!failure.ok) {
 *   console.error(failure.error.message); // "Network unreachable"
 * }
 * ```
 *
 * @remarks
 * By ensuring that all errors are non-null, this type supports explicit and reliable
 * error propagation in a functional-style control flow.
 */
export type Failure<E> = {
    ok: false;
    error: NonNullable<E>;
};

/**
 * A discriminated union representing the outcome of an operation that may succeed or fail.
 *
 * @template S - The type of the success value.
 * @template E - The type of the error. Defaults to the built-in `Error` type.
 *
 * @typedef {Success<S> | Failure<E>} Result
 *
 * @example
 * ```ts
 * function parseJson(input: string): Result<object, Error> {
 *   try {
 *     return Result.ok(JSON.parse(input));
 *   } catch (err) {
 *     return Result.error(err as Error);
 *   }
 * }
 *
 * const result = parseJson('{"valid": true}');
 * if (result.ok) {
 *   console.log("Parsed:", result.value);
 * } else {
 *   console.error("Failed to parse:", result.error.message);
 * }
 * ```
 *
 * @remarks
 * The `Result` type allows safe handling of both successful and failed outcomes
 * without relying on exceptions or null values. It provides a clear,
 * type-guarded contract for result-based logic in functional or asynchronous code.
 */
export type Result<S, E extends Error = Error> = Success<S> | Failure<E>;

/**
 * Utility factory for constructing `Result` objects in a consistent and type-safe manner.
 *
 * @namespace Result
 */
export const Result = {
    /**
    * Creates a `Success` result containing a non-null value.
    *
    * @template S - The type of the success value.
    * @param {NonNullable<S>} value - The non-null value to include in the success result.
    * @returns {Success<S>} A success result wrapping the given value.
    *
    * @example
    * ```ts
    * const success = Result.ok("Upload complete");
    * console.log(success.ok); // true
    * console.log(success.value); // "Upload complete"
    * ```
    */
    ok: <S>(value: NonNullable<S>): Success<S> => ({ ok: true, value }),

    /**
    * Creates a `Failure` result containing a non-null error.
    *
    * @template E - The type of the error, extending the built-in `Error` class.
    * @param {NonNullable<E>} error - The non-null error to include in the failure result.
    * @returns {Failure<E>} A failure result wrapping the given error.
    *
    * @example
    * ```ts
    * const failure = Result.error(new Error("Timeout"));
    * console.log(failure.ok); // false
    * console.log(failure.error.message); // "Timeout"
    * ```
    */
    error: <E extends Error>(error: NonNullable<E>): Failure<E> => ({ ok: false, error }),
}

