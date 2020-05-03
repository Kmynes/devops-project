import { 
    ExceptionFilter, 
    Catch, 
    ArgumentsHost, 
    ForbiddenException, 
    UnauthorizedException,
    Logger,
    NotFoundException,
    BadRequestException,
    BadGatewayException,
    UnsupportedMediaTypeException,
    ConflictException,
    GoneException,
    GatewayTimeoutException,
    MethodNotAllowedException,
    PayloadTooLargeException,
    UnprocessableEntityException,
    ServiceUnavailableException,
    NotAcceptableException,
    RequestTimeoutException,
    NotImplementedException,
    ImATeapotException,
    HttpException
  } from '@nestjs/common';
  
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger:Logger;

  constructor() {
    this.logger = new Logger("AllExceptionsFilter");
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const { message } = exception; 

    this.logger.error(`message: ${
        typeof message === "string" ? 
        message : JSON.stringify(message)
      }`);

    let status, data;
    if (exception instanceof BadGatewayException          ||
        exception instanceof BadRequestException          ||
        exception instanceof ConflictException            ||
        exception instanceof ForbiddenException           ||
        exception instanceof GatewayTimeoutException      ||
        exception instanceof GoneException                ||
        exception instanceof HttpException                ||
        exception instanceof ImATeapotException           ||
        exception instanceof MethodNotAllowedException    ||
        exception instanceof NotAcceptableException       ||
        exception instanceof NotFoundException            ||
        exception instanceof NotImplementedException      ||
        exception instanceof PayloadTooLargeException     ||
        exception instanceof RequestTimeoutException      ||
        exception instanceof ServiceUnavailableException  ||
        exception instanceof UnauthorizedException        ||
        exception instanceof UnprocessableEntityException ||
        exception instanceof UnsupportedMediaTypeException) {
        const { statusCode, message, error } = exception.message;
        status = statusCode;
        data = message || error;
    }else {
      status = 500;
      data = "Internal server error";
    }

    response.status(status)
      .send({ status, data });
  }
}