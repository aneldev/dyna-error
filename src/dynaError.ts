export interface IErrorConfig {
  message: string;        // Error message for debugging.
  userMessage?: string;   // Error message for the end user (ideally translated and without sensitive info).
  code?: number;          // Developer error code, any number to identify the point where the error occurred.
  status?: number;        // Network error status, http code or any status that other parts of the app can understand.
  data?: any;             // Error data for debugging (might contain sensitive info).
  userData?: any;         // Error data that can be delivered to the client/user.
  parentError?: any;      // Parent error
  validationErrors?: any; // Validation errors
  stack?: string;
  canRetry?: boolean;     // If the action that caused this error can be retried.
}

export interface IDynaError extends Error {
  date?: Date;
  message: string;
  userMessage?: string;
  code?: number;
  status?: number;
  data?: any;
  userData?: any;
  parentError?: any;
  validationErrors?: any;
  canRetry?: boolean;
  isDynaError?: true;
}

export const dynaError = (
  errorArg:
    | string
    | Error
    | IErrorConfig,
): IDynaError => {
  if (typeof errorArg === "string") {
    return dynaErrorByIDynaError({message: errorArg});
  }
  if (errorArg instanceof Error) {
    return dynaError({
      message: errorArg.message,
      stack: errorArg.stack,
    });
  }
  return dynaErrorByIDynaError(errorArg);
};

const dynaErrorByIDynaError = (
  {
    message,
    userMessage,
    code,
    status,
    data,
    userData,
    parentError,
    validationErrors,
    canRetry,
  }: IErrorConfig,
): IDynaError => {
  const fullMessage = [
    code !== undefined ? `${code}:` : '',
    message,
  ].filter(Boolean).join(' ');
  const nError = new Error(fullMessage);
  return removeUndefined({
    date: new Date,
    name: 'Error',
    code,
    status,
    message: fullMessage,
    userMessage,
    data,
    userData,
    parentError,
    validationErrors,
    canRetry,
    stack: nError.stack,
    isDynaError: true,
  });
};

const removeUndefined = (data: Record<string, any>): any => {
  for (const key in data) {
    if (data[key] === undefined) delete data[key];
  }
  return data;
};
