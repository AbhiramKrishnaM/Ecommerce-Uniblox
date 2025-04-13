export class ResponseUtil {
  static success(data = null, message = "Success") {
    return {
      data,
      message,
      code: 200,
    };
  }

  static created(data = null, message = "Created successfully") {
    return {
      data,
      message,
      code: 201,
    };
  }

  static error(message = "An error occurred", code = 500, data = null) {
    return {
      data,
      message,
      code,
    };
  }
}
