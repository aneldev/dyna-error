# dynaError

`dynaError` enriches JavaScript's `Error` with additional properties beyond just a message.

Create more detailed errors with properties like:

- `userMessage` for the end-user
- `code` and `status` for programmatic handling
- `data` for debugging

All while keeping the full benefits of native `Error`: stack traces, `instanceof` checks, and JSON serialization.

Written in TypeScript.

# Usage

_Examples are in TypeScript_

## Import

```typescript
import {
  IDynaError,
  DynaError,    // Optional — for instanceof checks or creatiuns with `new DynaError()`
  dynaError,    // Easy factory method
} from "dyna-error";
```

## Simple example

Instead of:
```typescript
throw new Error('Service not available');
```
You can do:
```typescript
throw dynaError('Service not available');
```
or:
```typescript
throw new DynaError({message: 'Service not available'});
```
or:
```typescript
throw dynaError({ message: 'Service not available' });
```
which is essentially the same.

Now with more detail:

```typescript
throw dynaError({
  message: 'Service not available',
  userMessage: 'Something went wrong, please retry',
  canRetry: true,
  data: {
    serviceResponse: {...}, // Additional info for debugging
  },
});
```

## Real example

```typescript
// A fetch function
const getUserSalary = async (userId: string): Promise<IUser> => {
  const salaryServiceAvailable = await fetchUserSalaryAvailable();

  if (!salaryServiceAvailable) throw dynaError({
    message: 'Service not ready',
    userMessage: 'System overloaded, please retry.',
    canRetry: true,
    data: {
      salaryInfo,
    },
  });

  return fetchUserSalary();
};


// Catch the error
try {
  await getUserSalary(userId);
} catch (e) {
  const error = dynaError(e); // wraps any unknown error into a DynaError (it is still JS Error)
  if (error.userMessage) alert(error.userMessage);
  setState({ canRetry: !!error.canRetry });
}
```

# API

## dynaError argument

`dynaError` accepts a string, a native `Error`, or an object based on the `IErrorConfig` interface.

In `IErrorConfig`, only the `message` is required.

```typescript
export interface IErrorConfig {
  /**
   * Error message intended for debugging purposes.
   */
  message: string;

  /**
   * User-friendly error message, ideally translated and devoid of sensitive information.
   */
  userMessage?: string;

  /**
   * Developer-assigned error code for identifying the point where the error occurred.
   */
  code?: number;

  /**
   * Network error status, which can be an HTTP code or any status understandable by other parts of the application.
   */
  status?: number;

  /**
   * Error data intended for debugging, may contain sensitive information.
   */
  data?: any;

  /**
   * Error data that can be safely delivered to the client or end-user.
   */
  userData?: any;

  /**
   * Reference to the parent error.
   */
  parentError?: any;

  /**
   * Validation errors associated with the error.
   */
  validationErrors?: any;

  /**
   * Whether to collect a stack trace.
   * Disable for security when the error may be sent to the client.
   *
   * @default true
   */
  stack?: boolean;

  /**
   * Indicates whether the action that caused this error can be retried.
   */
  canRetry?: boolean;

  /**
   * If true and `code` is defined, the error message is prefixed with the error code.
   *
   * @default false
   */
  prefixMessageWithCode?: boolean;
}
```

Full throw example:

```typescript
throw dynaError({
  message: 'Salary service not available',
  userMessage: 'Please retry',
  code: 330010,
  status: 200,
  parentError: e,
  validationErrors: { loginName: 'Is required' },
  canRetry: true,
  data: {
    userId: 230130042,
    salaryServiceResponse,
  },
});
```

## dynaError return value

`dynaError` returns a `DynaError` instance — a real `Error` subclass that satisfies the `IDynaError` interface.

```typescript
export interface IDynaError extends Error {
  date?: Date;
  message: string;
  userMessage?: string;
  code?: number;
  status?: number;
  data?: any;
  userData?: any;
  parentError?: any;
  stack?: string;
  validationErrors?: any;
  canRetry?: boolean;
  isDynaError?: true;
  toJSON(): Record<string, unknown>;
}
```

Because it extends `Error`:

```typescript
const error = dynaError({ message: 'Something failed' });

error instanceof Error     // true
error instanceof DynaError // true
```

### JSON serialization

`DynaError` has a `toJSON()` method, so it serializes correctly with `JSON.stringify`:

```typescript
JSON.stringify(error);
// → {"name":"Error","message":"Something failed","isDynaError":true,"date":"..."}
```

The `stack` property is intentionally excluded from JSON output — stack traces contain sensitive path information and should not be sent to clients.

Full catch example:

```typescript
try {
  return getSalary(userId);
} catch (e) {
  const error = dynaError(e);
  // All IDynaError properties are available.
  // dynaError() safely wraps any unknown value — even non-Error throws.
}
```

# REPL

Try `dynaError` interactively in a Node.js shell:

```bash
pnpm repl
```

Both `dynaError` and `DynaError` are pre-loaded in the context:

```
dyna-error> dynaError({ message: 'Service not available', canRetry: true })
dyna-error> new DynaError({ message: 'test' })
```

# Summary

`dynaError` gives you richer errors without giving up anything from native `Error`:

| Feature                            | `new Error()` | `dynaError()` |
|------------------------------------|---------------|---------------|
| Stack trace                        | ✅             | ✅             |
| `instanceof Error`                 | ✅             | ✅             |
| `userMessage`, `code`, `status`, … | ❌             | ✅             |
| Safe wrapping of unknown catches   | ❌             | ✅             |
| `JSON.stringify` (all fields)      | ❌             | ✅             |

# Changelog

## v1

First version.

## v2

Extended native JS `Error`.

## v3

Returns a new object compatible with JS `Error`.

## v4

- Compatible with `unknown` errors
- Always collects a stack trace, but it can be disabled via the `stack` property

## v5

- `dynaError()` now returns a real `DynaError extends Error` instance
- `err instanceof Error` → `true`
- `err instanceof DynaError` → `true` (the `DynaError` class is exported)
- Added `toJSON()` method for explicit, predictable JSON serialization — `stack` is excluded by default for security