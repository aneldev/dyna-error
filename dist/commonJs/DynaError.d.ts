export interface IErrorConfig {
    message: string;
    userMessage?: string;
    code?: number;
    status?: number;
    data?: any;
    parentError?: any;
    validationErrors?: any;
    canRetry?: boolean;
}
export interface IDynaError extends Error {
    date: Date;
    message: string;
    userMessage?: string;
    code?: number;
    status?: number;
    data?: any;
    parentError?: any;
    validationErrors?: any;
    canRetry?: boolean;
    isDynaError: true;
}
export declare const dynaError: (messageOrErrorConfig: string | IErrorConfig) => IDynaError;
