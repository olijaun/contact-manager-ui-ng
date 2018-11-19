import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  technicalErrors: string[] = [];
  businessErrors: string[] = [];
  info: string[] = [];

  addTechnicalError(message: string) {
    if (this.technicalErrors.filter(m => m === message).length === 0) {
      this.technicalErrors.push(message);
    }
  }

  addBusinessError(message: string) {
    if (this.businessErrors.filter(m => m === message).length === 0) {
      this.businessErrors.push(message);
    }
  }

  addInfo(message: string) {
    if (this.info.filter(m => m === message).length === 0) {
      this.info.push(message);
    }
  }

  containsMessages() : boolean {
    return this.technicalErrors.length > 0 || this.businessErrors.length > 0 || this.info.length > 0;
  }

  clear() {
    this.technicalErrors = [];
    this.businessErrors = [];
    this.info = [];
  }
}
