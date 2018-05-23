import {Component, OnInit} from '@angular/core';
import {Contact} from '../contact';
import {ContactService} from '../contact.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.contactService.getContacts()
      .subscribe(heroes => this.contacts = heroes.slice(1, 5));
  }
}
