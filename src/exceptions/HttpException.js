class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpException;
