import {Component, OnInit} from '@angular/core';
import {Person} from '../person';
import {PersonService} from '../person.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Person[];

  constructor(private contactService: PersonService) {
  }

  ngOnInit() {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getPersons()
      .subscribe(contacts => this.contacts = contacts);
  }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.contactService.addPerson({ name } as Contact)
  //     .subscribe(person => {
  //       this.contacts.push(person);
  //     });
  // }

  delete(contact: Person): void {
    this.contacts = this.contacts.filter(h => h !== contact);
    this.contactService.deletePerson(contact).subscribe();
  }
}
