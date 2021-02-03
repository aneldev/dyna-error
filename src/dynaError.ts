export interface IErrorConfig {
  message: string;        // Error message for debugging.
  userMessage?: string;   // Error message for the end user (ideally translated and without sensitive info).
  code?: number;          // Developer error code, any number to identify the point where the error occurred.
  status?: number;        // Network error status, http code or any status that other parts of the app can understand.
  data?: any;             // Error data for debugging.
  canRetry?: boolean;     // If the action that caused this error can be retried.
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

export const dynaError = (messageOrErrorConfig: string | IErrorConfig): IDynaError => {
  return typeof messageOrErrorConfig === "string"
    ? dynaErrorByString(messageOrErrorConfig)
    : dynaErrorByObject(messageOrErrorConfig);
};

const dynaErrorByString = (message: string): IDynaError => {
  return dynaErrorByObject({message});
};

const dynaErrorByObject = (
  {
    message,
    userMessage,
    code,
    status,
    data,
    canRetry,
  }: IErrorConfig,
): IDynaError => {
  const error: IDynaError = new Error(`${code === undefined ? '' : `${code} `}${message}`) as any;
  error.date = new Date();
  error.userMessage = userMessage;
  error.code = code;
  error.status = status;
  error.data = data;
  error.canRetry = canRetry;
  error.isDynaError = true;
  return error;
};
