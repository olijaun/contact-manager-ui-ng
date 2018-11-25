import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  technicalErrors: string[] = [];
  businessErrors: string[] = [];
  info: string[] = [];

  constructor(private translate: TranslateService) {

  }

  addTechnicalError(message: string, error: Error) {

    this.translate.get(message).subscribe(translatedMsg => {

      if (this.technicalErrors.filter(m => m === translatedMsg).length === 0) {
        this.technicalErrors.push(translatedMsg + ": " + error.message);
      }
    });
  }

  addBusinessError(message: string) {

    this.translate.get(message).subscribe(translatedMsg => {

      if (this.businessErrors.filter(m => m === translatedMsg).length === 0) {
        this.businessErrors.push(translatedMsg);
      }
    });
  }

  addInfo(message: string) {
    this.translate.get(message).subscribe(translatedMsg => {
      if (this.info.filter(m => m === translatedMsg).length === 0) {
        this.info.push(message);
      }
    });
  }

  containsMessages(): boolean {
    return this.technicalErrors.length > 0 || this.businessErrors.length > 0 || this.info.length > 0;
  }

  clear() {
    this.technicalErrors = [];
    this.businessErrors = [];
    this.info = [];
  }
}
