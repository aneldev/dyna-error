# dynaError

`dynaError` extends the JavaScript's `Error` with more data than a message only.

Create more sophisticated errors, with more properties like the

- `userMessage` property for the end-user, or
- with more `data` for debugging 

together with the native `Error` with the great stack.

Written in TypeScript.

# Usage
_Examples are in a TypeScript_

## Import
```
import {dynaError} from "dyna-error";
```

## Simple example

Instead of
```
throw new Error ('Service not available');
```
do this
```
throw dynaError('Service not available');
```
or this
```
throw dynaError({message: 'Service not available'});
```
where is the same.

Now add some more info about this error

```
throw dynaError({
  message: 'Service not available',
  userMessage: 'Something went wrong, please retry',
  canRetry: true,
  data: {
    serviceResponse: {...} // Pass more info for debugging
  }
});
```

## Real example

```
// A fetch function
const getUserSalary = async (userId: string): Promise<IUser> => {
  const salaryServiceAvaialble = await getchUserSalaryAvaialble();
  
  if (!salaryServiceAvaialble) throw dynaError({
    message: 'Service not ready',
    userMessage: 'System overlaoaded, please retry.',
    canRetry: true,
    data: {
      salaryInfo,
    },
  });
  
  return getchUserSalary();
};


// Catch the error
try {
  await getUserSalary(userId);
} catch (e) {
  const error: IDynaError = e;  // It is free cast it, even if the e is not a IDynaError.
  if (error.userMessage) alert(error.userMessage);
  setState(canRetry: !!error.canRetry);
}
```

# API

## dynaError arg object

`dynaError` expects a string to be the message of the error **or** an object of the `IErrorConfig` interface.

From the `IErrorConfig`, only the `message` is required.

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

A full example of a `dynaError` thrown.

```
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

## dynaError thrown Error

This is what `dynaError` returns

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
A full example of a `dynaError` catch.

```
try {
  return getSalary(userId);
} catch(e) {
  const error: IDynaError = e;
  // Here you have all properties of the above IDynaError interface.
  // You are free to cast the e, even if it is not a dynaError.
  // Since all properties of IDynaError are optional the output cast is valid.
}
```
# Sum up

In JavaScript, you can throw anything as an error. It is not wrong to throw an object as an error, but you miss a few things.

Throwing an object as an error
You don't have the `stack`
The error is not an `Error` instance

With `dynaError` you have rich errors that can consume them easier.

`IDynaError` is full compatible with Javascript's `Error`.

# Change log

## v1

**First version**

## v2

Extends Native JS Error

## v3

Returns new object compatible with JS Error.

This make the error serializable for JSON.stringify.

## v4

- Compatible with `unknwon` errors
- Collects always `stack` trace, but can be disabled by the `stack` property