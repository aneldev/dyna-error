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
throw dynaError({message: 'Service not available'});
```
add some more info about this error

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

`dynaError` expects an object of the IErrorConfig interface.

Only the `message` is required.

```
IErrorConfig {
  message: string;        // Error message for debugging.
  userMessage?: string;   // Error message for the end-user (ideally translated and without sensitive info).
  code?: number;          // Developer error code, any number to identify the point where the error occurred.
  status?: number;        // Network error status, HTTP code, or any status that other parts of the app can understand.
  data?: any;             // Error data for debugging.
  canRetry?: boolean;     // If the action that caused this error can be retried.
}

```

A full example of a `dynaError` thrown.

```
throw dynaError({
  message: 'Salary service not available',
  userMessage: 'Please retry',
  code: 330010,
  status: 200,
  canRetry: true,
  data: {
    userId: 230130042,
    salaryServiceResponse,
  },
});
```

## dynaError thrown Error

This is what `dynaError` returns

```
interface IDynaError extends Error {
  date: Date;               // The date that the error occured
  message: string;          // What you applied on `dynaError`
  userMessage?: string;     // What you applied on `dynaError`
  code?: number;            // What you applied on `dynaError`
  status?: number;          // What you applied on `dynaError`
  data?: any;               // What you applied on `dynaError`
  canRetry?: boolean;       // What you applied on `dynaError`
  isDynaError: true;        // Informative, just gives the info if you used the `dynaError` for this error
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
