import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body ? JSON.stringify(request.body) : 'empty';

    this.logger.log(`>> Request: [${method}] ${url} - Body: ${body}`);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const responseBody = data ? JSON.stringify(data) : 'empty';
        this.logger.log(
          `<< Response: [${method}] ${url} - Status: ${statusCode} - Body: ${responseBody}`,
        );
      }),
    );
  }
}
