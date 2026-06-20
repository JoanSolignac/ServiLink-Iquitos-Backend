import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainException } from '../exceptions/domain.exception';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly codeToStatus: Record<DomainErrorCode, HttpStatus> = {
    [DomainErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.PROFILE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.SERVICE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.AUTH_IDENTITY_NOT_FOUND]: HttpStatus.NOT_FOUND,

    [DomainErrorCode.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [DomainErrorCode.PROFILE_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [DomainErrorCode.USER_ALREADY_ACTIVE]: HttpStatus.CONFLICT,
    [DomainErrorCode.USER_ALREADY_INACTIVE]: HttpStatus.CONFLICT,
    [DomainErrorCode.USER_ALREADY_SUSPENDED]: HttpStatus.CONFLICT,
    [DomainErrorCode.USER_NOT_SUSPENDED]: HttpStatus.CONFLICT,
    [DomainErrorCode.USER_ALREADY_HAS_ROLE]: HttpStatus.CONFLICT,

    [DomainErrorCode.SERVICE_UNAUTHORIZED]: HttpStatus.FORBIDDEN,
    [DomainErrorCode.USER_SUSPENDED]: HttpStatus.FORBIDDEN,

    [DomainErrorCode.INVALID_PROVIDER]: HttpStatus.BAD_REQUEST,
    [DomainErrorCode.PROVIDER_CONFLICT]: HttpStatus.CONFLICT,
    [DomainErrorCode.SERVICE_ALREADY_APPROVED]: HttpStatus.CONFLICT,

    [DomainErrorCode.RATING_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [DomainErrorCode.RATING_NOT_ALLOWED]: HttpStatus.FORBIDDEN,
    [DomainErrorCode.RATING_NOT_FOUND]: HttpStatus.NOT_FOUND,

    [DomainErrorCode.FAVORITE_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [DomainErrorCode.FAVORITE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.FAVORITE_NOT_ALLOWED]: HttpStatus.FORBIDDEN,
  };

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      this.codeToStatus[exception.errorCode] ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      errorCode: exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
