import {Component, OnInit, ViewChild} from '@angular/core';
import {Contact, Name, StreetAddress} from '../contact';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ContactService} from '../contact.service';
import {NgForm} from '@angular/forms';
import {cloneDeep, isEqual, isNil, toString} from 'lodash';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  contact: Contact;
  streetAddress: StreetAddress;
  originalContact: Contact;

  @ViewChild('basicForm') public basicForm: NgForm;

  sexes = [
    {value: 'MALE', viewValue: 'Male'},
    {value: 'FEMALE', viewValue: 'Female'}
  ];

  types = [
    {value: 'PERSON', viewValue: 'Person'},
    {value: 'COMPANY', viewValue: 'Company'}
  ];

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location
  ) {

  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.streetAddress = new StreetAddress();
    this.streetAddress.isoCountryCode = 'CH';

    if (isNil(id)) {
      console.log('new address: ' + id);
      this.contact = new Contact();
      this.contact.contactType = 'PERSON';
      this.contact.name = new Name();


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
      .subscribe(contact => {
        this.contact = contact;

        if (isNil(this.contact.streetAddress)) {
          this.streetAddress = new StreetAddress();
        } else {
          this.streetAddress = this.contact.streetAddress;
        }

        this.originalContact = cloneDeep(this.contact);
      });
  }

  goBack(): void {
    this.location.back();
  }

  isNew() {
    return isNil(this.contact.contactId);
  }

  isEmpty(address: StreetAddress) {
    return (isNil(address.street) && isNil(address.city) && isNil(address.state) && isNil(address.streetNumber) && isNil(address.zip));
  }

  save(): void {

    const contractToBeSaved = cloneDeep(this.contact);

    if (!this.isEmpty(this.streetAddress)) {
      contractToBeSaved.streetAddress = this.streetAddress;
    }

    if (isEqual(this.originalContact, contractToBeSaved)) {
      console.log('no change');
      return;
    }

    if (this.isNew()) {

      this.contact.contactId = UUID.UUID();
      this.contactService.updateContact(contractToBeSaved).subscribe();
      console.log('saveNewContact');

    } else {

      console.log('original address: ' + this.originalContact.streetAddress);
      console.log('contractToBeSaved: ' + contractToBeSaved.streetAddress);

      if (!isEqual(this.originalContact.streetAddress, contractToBeSaved.streetAddress)) {
        //this.contactService.updateContact(contractToBeSaved).subscribe(() => {}, e => this.bla(e));
        console.log('updateAddress');
      }

      if (!isEqual(this.originalContact.name, contractToBeSaved.name)) {
        console.log('updateName' + JSON.stringify(this.originalContact.name) + ', after: ' + JSON.stringify((contractToBeSaved.name)));
      }
    }
  }

  bla(error: any): void {

  }
}
