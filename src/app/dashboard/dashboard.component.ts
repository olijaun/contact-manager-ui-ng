import {Component, OnInit} from '@angular/core';
import {Person} from '../person';
import {PersonService} from '../person.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contacts: Person[] = [];

  constructor(private contactService: PersonService) {
  }

  ngOnInit() {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getPersons()
      .subscribe(contacts => this.contacts = contacts.slice(1, 5));
  }
}
