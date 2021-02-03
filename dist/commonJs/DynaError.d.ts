export interface IErrorConfig {
    message: string;
    userMessage?: string;
    code?: number;
    status?: number;
    data?: any;
    canRetry?: boolean;
}
export interface IDynaError extends Error {
    date: Date;
    message: string;
    userMessage?: string;
    code?: number;
    status?: number;
    data?: any;
    canRetry?: boolean;
    isDynaError: true;
}
export declare const throwDynaError: (messageOrErrorConfig: string | IErrorConfig) => void;
export declare const dynaError: (messageOrErrorConfig: string | IErrorConfig) => IDynaError;
