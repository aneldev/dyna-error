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
  toJSON(): Record<string, unknown>;
}

export class DynaError extends Error implements IDynaError {
  date: Date;
  userMessage?: string;
  code?: number;
  status?: number;
  data?: any;
  userData?: any;
  parentError?: any;
  validationErrors?: any;
  canRetry?: boolean;
  isDynaError = true as const;

  constructor({
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
  }: IErrorConfig
  = {message: "Unknown dyna error"}) {
    const fullMessage = [
      code !== undefined && prefixMessageWithCode ? `${code}:` : '',
      message,
    ].filter(Boolean).join(' ');

    super(fullMessage);

    // Make message enumerable so {...err} and JSON.stringify include it
    Object.defineProperty(this, 'message', {
      value: fullMessage,
      enumerable: true,
      writable: true,
      configurable: true,
    });

    // Own enumerable property for backward compat with spread/snapshots
    this.name = 'Error';
    this.date = new Date();

    if (userMessage !== undefined) {
      this.userMessage = userMessage;
    }
    if (code !== undefined) {
      this.code = code;
    }
    if (status !== undefined) {
      this.status = status;
    }
    if (data !== undefined) {
      this.data = data;
    }
    if (userData !== undefined) {
      this.userData = userData;
    }
    if (parentError !== undefined) {
      this.parentError = parentError;
    }
    if (validationErrors !== undefined) {
      this.validationErrors = validationErrors;
    }
    if (canRetry !== undefined) {
      this.canRetry = canRetry;
    }

    if (_applyStackContent) {
      this.stack = _applyStackContent;
    }
    else if (!stack) {
      this.stack = undefined;
    }
  }

  toJSON(): Record<string, unknown> {
    const output: Record<string, unknown> = {
      name: this.name,
      message: this.message,
      isDynaError: this.isDynaError,
      date: this.date,
    };
    if (this.userMessage !== undefined) {
      output.userMessage = this.userMessage;
    }
    if (this.code !== undefined) {
      output.code = this.code;
    }
    if (this.status !== undefined) {
      output.status = this.status;
    }
    if (this.data !== undefined) {
      output.data = this.data;
    }
    if (this.userData !== undefined) {
      output.userData = this.userData;
    }
    if (this.parentError !== undefined) {
      output.parentError = this.parentError;
    }
    if (this.validationErrors !== undefined) {
      output.validationErrors = this.validationErrors;
    }
    if (this.canRetry !== undefined) {
      output.canRetry = this.canRetry;
    }
    return output;
  }
}

export const dynaError = (
  errorArg:
    | string
    | Error
    | IErrorConfig
    | unknown,
): IDynaError => {
  if (typeof errorArg === 'string') {
    return new DynaError({message: errorArg});
  }
  if (errorArg instanceof Error) {
    if ((errorArg as IDynaError).isDynaError) {
      return errorArg as IDynaError;
    }
    return new DynaError({
      message: errorArg.message,
      _applyStackContent: errorArg.stack,
    });
  }
  if (errorArg && (errorArg as any)?.message) {
    return new DynaError(errorArg as IErrorConfig);
  }
  return new DynaError({
    message: 'Unknown nature of error',
    parentError: {error: errorArg},
  });
};
