import {Observable, of, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "./message.service";

export class DefaultServiceErrorHandler {
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public static handleError<T>(messageService: MessageService, operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error instanceof HttpErrorResponse) {
        const httpError: HttpErrorResponse = error as HttpErrorResponse;

        if (httpError.status >= 400 && httpError.status <= 500) {
          messageService.addBusinessError("validation-error");

          if (result) {
            return of(result as T);
          }

          return throwError(error);
        }
      }

      messageService.addTechnicalError('technical-error', error);

      if (result) {
        return of(result as T);
      }

      return throwError(error);
    };
  }
}
