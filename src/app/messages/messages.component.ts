import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public messageService: MessageService) {
  }

  ngOnInit() {
  }

  containsMessages(): boolean {
    console.log("contains messages: " + this.messageService.containsMessages());
    return this.messageService.containsMessages();
  }

}
