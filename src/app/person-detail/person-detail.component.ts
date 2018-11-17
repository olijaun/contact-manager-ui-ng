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
import {CountryService} from "../country.service";
import {CountryCode} from "../countries";
import {Observable} from "rxjs";
import {map, startWith, tap} from 'rxjs/operators';

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
  unmappedErrors: string[] = [];
  countries: CountryCode[] = [];

  country: FormControl = new FormControl({ 'Name': 'Switzerland', 'Code': "CH"});

  filteredOptions: Observable<CountryCode[]>;

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
    private countryService: CountryService,
    private location: Location,
    private fb: FormBuilder
  ) {

    this.personDetailForm = this.fb.group({
      firstName: new FormControl('', [Validators.maxLength(256)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(256)]),
      birthDate: new FormControl(),
      sex: new FormControl(this.sexes[0]),
      phoneNumber: new FormControl(),
      emailAddress: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
      address: fb.group({
        street: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        number: new FormControl(''), //[]),
        zip: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        city: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        country: this.country,
      }, {validator: this.addressValidator})
      // check: https://stackoverflow.com/questions/42789158/creating-optional-nested-formgroups-in-angular-2
    });

  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (isNil(id)) {
      console.log('new id: ' + id);
      this.person = new Person();
      this.person.type = 'NATURAL';
      this.person.streetAddress.isoCountryCode = 'CH';
    } else {
      this.loadPerson();
    }


    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;

      this.filteredOptions = this.country.valueChanges.pipe(
        startWith<string | CountryCode>(''),
        tap(value => console.log("tap value: " + value)),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.countries.slice())
      );
    });
  }

  displayFn(countryCode?: CountryCode): string | undefined {
    console.log('displayFn: ' + countryCode);
    return countryCode ? countryCode.Name : undefined;
  }

  private _filter(name: string): CountryCode[] {
    console.log('filter: ' + name);
    const filterValue = name.toLowerCase();

    var res = this.countries.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
    console.log("r: " + JSON.stringify(res));

    return res;
  }

  // requiredIfAddressNonEmpty(): ValidatorFn {
  //   return (c: AbstractControl): { [key: string]: any } => {
  //
  //     if (!this.personDetailForm) {
  //       console.log("form is undefined")
  //       return null;
  //     }
  //
  //     console.log('validate: ');
  //
  //     var addressFormGroup = this.personDetailForm.get('address') as FormGroup;
  //
  //     var street = addressFormGroup.get('street').value;
  //     var number = addressFormGroup.get('number').value;
  //     var zip = addressFormGroup.get('zip').value;
  //     var city = addressFormGroup.get('city').value;
  //     var country = addressFormGroup.get('country').value;
  //
  //     addressFormGroup.markAsTouched({ onlySelf: false });
  //     // Object.keys(addressFormGroup.controls).forEach(field => { // {1}
  //     //   console.log('field: ' + field);
  //     //   const control = addressFormGroup.get(field);            // {2}
  //     //   control.markAsTouched({ onlySelf: true });       // {3}
  //     // });
  //
  //     if (street || number || zip || city || country) {
  //       console.log("validate: " + c.value);
  //       if (!c.value) {
  //         return {'required': true};
  //       }
  //     } else {
  //       console.log("no validation required");
  //     }
  //
  //     return null;
  //   }
  // }

  addressValidator(control: FormControl): { [key: string]: boolean } {

    var street = control.get('street').value;
    var number = control.get('number').value;
    var zip = control.get('zip').value;
    var city = control.get('city').value;
    var country = control.get('country').value;

    if (street || number || zip || city) {
      console.log("validation required: " + street + ", " + zip + ", " + city + ", " + country);

      if (!street) {
        control.get('street').setErrors({
          "incorrect": true
        });
      }
      if (!zip) {
        control.get('zip').setErrors({
          "incorrect": true
        });
      }
      if (!city) {
        control.get('city').setErrors({
          "incorrect": true
        });
      }
      if (!country) {
        control.get('country').setErrors({
          "incorrect": true
        });
      }
      //control.get('street').setValidators(() => Validators.required);

      // if(!street || !zip || !city || !country) {
      //   return { city: true };
      // }
    }
    console.log("address is valid");
    return null;
    // if (email.value === confirm.value) {
    //   return null;
    // } else {
    //   return { nomatch: true };
    // }
  };




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
