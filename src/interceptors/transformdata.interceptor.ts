import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body.quantity) {
      request.body.quantity = Number(request.body.quantity);
    }

    return next.handle().pipe(
      map((data) => {
        if (data.quantity) {
          data.quantity = Number(data.quantity);
        }
        return data;
      }),
    );
  }
}
