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

export const dynaError = (
  errorArg:
    | string
    | Error
    | IErrorConfig
    | unknown,
): IDynaError => {
  if (typeof errorArg === "string") {
    return dynaErrorByIDynaError({message: errorArg});
  }
  if (errorArg instanceof Error) {
    return dynaError({
      message: errorArg.message,
      _applyStackContent: errorArg.stack,
    });
  }
  if (errorArg && (errorArg as any)?.message) {
    return dynaErrorByIDynaError(errorArg as any);
  }
  // This is a case of something strage unknown
  return dynaError({
    message: "Unknown nature of error",
    parentError: {error: errorArg},
  });
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
    stack = true,
    _applyStackContent,
    canRetry,
    prefixMessageWithCode = false,
  }: IErrorConfig,
): IDynaError => {
  const fullMessage = [
    code !== undefined && prefixMessageWithCode
      ? `${code}:`
      : '',
    message,
  ]
    .filter(Boolean)
    .join(' ');
  return removeUndefined({
    date: new Date(),
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
    stack:
      _applyStackContent
        ? _applyStackContent
        : stack
          ? new Error(fullMessage).stack
          : undefined,
    isDynaError: true,
  });
};

const removeUndefined = (data: Record<string, any>): any => {
  for (const key in data) {
    if (data[key] === undefined) delete data[key];
  }
  return data;
};
