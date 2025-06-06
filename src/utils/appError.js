class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this;
  }
}

export default AppError;
