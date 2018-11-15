///<reference path="../../../node_modules/moment/moment.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {ContactData, Person, StreetAddress} from '../person';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {PersonService} from '../person.service';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {isNil} from 'lodash';
import {UUID} from 'angular2-uuid';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-contact-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class PersonDetailComponent implements OnInit {

  // https://angular-templates.io/tutorials/about/angular-forms-and-validations

  personDetailForm: FormGroup;
  person: Person;
  birthDateControl = new FormControl(null);
  submitted: boolean = false;
  unmappedErrors: string[] = [];

  validation_messages = {
    'firstName': [
      // {type: 'required', message: 'Full name is required'},
      {type: 'incorrect', message: 'Komischer Fehler'}
    ],
    'lastName': [
      {type: 'required', message: 'last name is required'},
      {type: 'maxlength', message: 'last name cannot be more than 256 characters long'},
    ],
    'birthDate': [
      // {type: 'required', message: 'Please insert your birthday'},
    ],
    'sex': [
      {type: 'required', message: 'Please select your gender'},
    ]
  };


  // basicData: BasicData;
  // streetAddress: StreetAddress;
  // contactData: ContactData;
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
    private location: Location,
    private fb: FormBuilder
  ) {
    this.personDetailForm = this.fb.group({
      firstName: new FormControl('', [Validators.maxLength(256)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(256)]),
      birthDate: new FormControl(),
      sex: new FormControl(this.sexes[0]),
    });
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
        if (this.person.basicData != null) {
          this.birthDateControl.setValue(_moment(this.person.basicData.birthDate));
        }

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

  save(f: NgForm): void {

    console.log("save: " + f);

    this.unmappedErrors = [];

    this.personDetailForm.get('firstName').setErrors({
      "incorrect": true
    });

    this.unmappedErrors.push("Ein Fehler... oh nein!")

    return;

    if (!this.personDetailForm.valid) {
      // this.restService.create(this.form.value)
      //   .subscribe(
      //     entry => this.handleSubmitSuccess(entry),
      //     error => this.handleSubmitError(error)
      //   );
    }
    console.log("submit");

    if (this.isNew()) {
      this.person.id = UUID.UUID();
    }

    const personToBeSaved = new Person();

    personToBeSaved.id = this.person.id;
    personToBeSaved.type = this.person.type;
    personToBeSaved.basicData = this.person.basicData;

    var offset = new Date().getTimezoneOffset();
    console.log(offset);

    if (!isNullOrUndefined(this.birthDateControl.value)) {
      var formattedLocalDate = _moment(this.birthDateControl.value).local(true).format(_moment.HTML5_FMT.DATE);
      console.log("vvvvvvvvvvvvalue: " + formattedLocalDate);
      personToBeSaved.basicData.birthDate = formattedLocalDate;
    }

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
