import {MessageService} from "./message.service";

export interface ValidationErrorHandler {

  handle(code: string, attribute?: string): void;

  handleNotFound(attribute: string): void;
};

export class DefaultValidationErrorHandler implements ValidationErrorHandler {

  public constructor(private messageService: MessageService) {

  }

  public handle(code: string, attribute?: string): void {
    this.messageService.addBusinessError(code);
  }

  public handleNotFound(attribute: string): void {
    this.messageService.addBusinessError("Not found");
  }
}
