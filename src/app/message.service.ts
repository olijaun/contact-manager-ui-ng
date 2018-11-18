import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  messages: string[] = [];

  addTechnicalError(message: string) {
    if (this.messages.filter(m => m === message).length === 0) {
      this.messages.push(message);
    }
  }

  addBusinessError(message: string) {
    console.log("addBusiness error");
    if (this.messages.filter(m => m === message).length === 0) {
      this.messages.push(message);
    }
  }

  clear() {
    this.messages = [];
  }
}
