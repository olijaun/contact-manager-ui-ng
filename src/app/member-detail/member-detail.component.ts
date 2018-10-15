import {Component, OnInit, ViewChild} from '@angular/core';
import {UUID} from "angular2-uuid";
import {ContactData, Person, StreetAddress} from "../person";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PersonService} from "../person.service";
import {NgForm} from "@angular/forms";
import {Member} from "../member";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  // basicData: BasicData;
  // streetAddress: StreetAddress;
  // contactData: ContactData;

  @ViewChild('basicForm') public basicForm: NgForm;

  sexes = [
    {value: 'MALE', viewValue: 'Male'},
    {value: 'FEMALE', viewValue: 'Female'}
  ];

  types = [
    {value: 'NATURAL', viewValue: 'Person'},
    {value: 'JURISTIC', viewValue: 'Company'}
  ];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private location: Location
  ) {

  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (isNil(id)) {
      console.log('new address: ' + id);
      this.person = new Person();
      this.person.type = 'NATURAL';
      this.person.streetAddress.isoCountryCode = 'CH';
    } else {
      this.loadPerson();
    }
  }

  isPerson(): boolean {
    return (this.person.type === 'NATURAL');
  }

  loadPerson(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.personService.getPerson(id)
      .subscribe(person => {
        this.person = person;

        // if (isNil(this.person.streetAddress)) {
        //   this.streetAddress = new StreetAddress();
        // } else {
        //   this.streetAddress = this.person.streetAddress;
        // }
        //
        // if (isNil(this.person.contactData)) {
        //   this.contactData = new ContactData();
        // } else {
        //   this.contactData = this.person.contactData;
        // }
      });
  }

  goBack(): void {
    this.location.back();
  }

  isNew() {
    return isNil(this.person.id);
  }

  isEmptyStreetAddress(address: StreetAddress) {
    return (isNil(address.street) && isNil(address.city) && isNil(address.state) && isNil(address.streetNumber) && isNil(address.zip));
  }

  isEmptyContactData(contactData: ContactData) {
    return (isNil(contactData.emailAddress) && isNil(contactData.phoneNumber));
  }

  save(): void {

    if (this.isNew()) {
      this.person.id = UUID.UUID();
    }

    const personToBeSaved = new Person();

    personToBeSaved.id = this.person.id;
    personToBeSaved.type = this.person.type;
    personToBeSaved.basicData = this.person.basicData;

    // do not add empty entitites
    if (this.isEmptyStreetAddress(this.person.streetAddress)) {
      personToBeSaved.streetAddress = null;
    } else {
      personToBeSaved.streetAddress = this.person.streetAddress;
    }

    if (this.isEmptyContactData(this.person.contactData)) {
      personToBeSaved.streetAddress = null;
    } else {
      personToBeSaved.contactData = this.person.contactData;
    }

    this.personService.updatePerson(personToBeSaved).subscribe();
    console.log('saved person: ' + personToBeSaved);
  }

  bla(error: any): void {

  }
}
