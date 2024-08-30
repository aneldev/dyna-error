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
     */
    stack?: string;
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
export declare const dynaError: (errorArg: string | Error | IErrorConfig) => IDynaError;
