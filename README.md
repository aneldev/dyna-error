# dynaError

`dynaError` enhances JavaScript's `Error` by adding more data beyond just a message.

Create more detailed errors with properties like:

- `userMessage` for the end-user, or
- Additional `data` for debugging

All this while keeping the benefits of the native `Error`, including the stack trace.

Written in TypeScript.

# Usage
_Examples are in TypeScript_

## Import
```typescript
import {
  IDynaError,
  dynaError,
} from "dyna-error";
```

## Simple Example

Instead of this:
```typescript
throw new Error('Service not available');
```
You can do this:
```typescript
throw dynaError('Service not available');
```
or this:
```typescript
throw dynaError({ message: 'Service not available' });
```
which is essentially the same.

Now, let's add some more details to this error:

```typescript
throw dynaError({
  message: 'Service not available',
  userMessage: 'Something went wrong, please retry',
  canRetry: true,
  data: {
    serviceResponse: {...} // Additional info for debugging
  }
});
```

## Real Example

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
  const error: IDynaError = e;  // You can safely cast it, even if e is not an IDynaError.
  if (error.userMessage) alert(error.userMessage);
  setState({ canRetry: !!error.canRetry });
}
```

# API

## dynaError Argument Object

`dynaError` accepts a string as the error message **or** an object based on the `IErrorConfig` interface.

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
   * Stack trace representing the error.
   *
   * Collect stack or not.
   * For security reasons (if the error is shipped to the client) might be not wanted.
   *
   * @default true
   */
  stack?: boolean;      // Do not collect stack (for security reasons)

  /**
   * Indicates whether the action that caused this error can be retried.
   */
  canRetry?: boolean;

  /**
   * If code is defined, the error message will be prefixed with the error code.
   *
   * @default false
   */
  prefixMessageWithCode?: boolean;

  // For internal use, do not use it!.
  _applyStackContent?: any;
}
```

Here’s a full example of a `dynaError` being thrown:

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

## dynaError Thrown Error

This is what `dynaError` returns:

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
}
```

Here’s a full example of a `dynaError` being caught:

```typescript
try {
  return getSalary(userId);
} catch(e) {
  const error: IDynaError = e;
  // Here you have all properties from the above IDynaError interface.
  // You can safely cast e, even if it's not a dynaError.
  // Since all properties of IDynaError are optional, the output cast is valid.
}
```

# Summary

In JavaScript, you can throw anything as an error. It’s not wrong to throw an object as an error, but you miss a few things:

- No `stack` trace
- The error is not an `Error` instance

With `dynaError`, you get richer errors that are easier to handle.

`IDynaError` is fully compatible with JavaScript’s `Error`.

# Changelog

## v1

**First version**

## v2

Extended Native JS Error

## v3

Returns a new object compatible with JS Error.

This makes the error serializable with `JSON.stringify`.

## v4

- Compatible with `unknown` errors
- Always collects a `stack` trace, but it can be disabled using the `stack` property.