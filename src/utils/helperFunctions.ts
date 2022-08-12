const throwCustomError = (errorMessage: string, errorStatus: number) => {
  const error: any = new Error(errorMessage);
  error.status = errorStatus;
  throw error;
};

export { throwCustomError };
