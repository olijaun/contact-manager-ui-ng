import {Component, Input, OnInit} from '@angular/core';
import {Contact, Name, StreetAddress} from '../contact';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ContactService} from '../contact.service';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: Contact;

  sexes = [
    {value: 'MALE', viewValue: 'Male'},
    {value: 'FEMALE', viewValue: 'Female'}
  ];

  types = [
    {value: 'PERSON', viewValue: 'Person'},
    {value: 'Company', viewValue: 'Company'}
  ];

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location
  ) {
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.contact = new Contact();
      this.contact.contactType = 'PERSON';
      this.contact.name = new Name();
      this.contact.streetAddress = new StreetAddress();
      this.contact.streetAddress.isoCountryCode = 'CH';

    } else {
      this.getContact();
    }
  }

  isPerson(): boolean {
    return (this.contact.contactType === 'PERSON');
  }

  getContact(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.contactService.getContact(id)
      .subscribe(contact => this.contact = contact);
  }

  goBack(): void {
    this.location.back();
  }

  isNew() {
    return this.contact.contactId === undefined;
  }

  save(): void {

    if (this.isNew()) {
      this.contact.contactId = UUID.UUID();
    }

    this.contactService.updateContact(this.contact).subscribe();
    // .subscribe(() => this.goBack());
  }

}
