///<reference path="../../../node_modules/moment/moment.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {BasicData, ContactData, Name, Person, StreetAddress} from '../person';
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
import {PhoneValidator} from "./phone.validator";
import {MessageService} from "../message.service";

@Component({
  selector: 'app-person-detail',
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
  birthDateControl = new FormControl(null);
  countries: CountryCode[] = [];

  country: FormControl = new FormControl({'Name': 'Switzerland', 'Code': "CH"});

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
    {value: 'MALE', viewValue: 'male'},
    {value: 'FEMALE', viewValue: 'female'}
  ];

  types = [
    {value: 'NATURAL', viewValue: 'natural-person'},
    {value: 'JURISTIC', viewValue: 'juristic-person'}
  ];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private countryService: CountryService,
    private messageService: MessageService,
    private location: Location,
    private fb: FormBuilder
  ) {

    this.personDetailForm = this.fb.group({
      id: new FormControl(UUID.UUID()),
      type: new FormControl(this.types[0]),
      firstName: new FormControl(null, [Validators.maxLength(60)]),
      lastNameOrCompanyName: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
      birthDate: this.birthDateControl,
      sex: new FormControl(null),
      phoneNumber: new FormControl(null, PhoneValidator.validCountryPhone(this.country)),
      emailAddress: new FormControl('', [Validators.email]), //, [this.requiredIfAddressNonEmpty()]),
      address: fb.group({
        street: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        streetNumber: new FormControl(''), //[]),
        zip: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        city: new FormControl(''), //, [this.requiredIfAddressNonEmpty()]),
        isoCountryCode: this.country,
      }, {validator: this.addressValidator})
      // check: https://stackoverflow.com/questions/42789158/creating-optional-nested-formgroups-in-angular-2
    });

  }

  ngOnInit() {

    if (!this.isNew()) {
      this.loadPerson();
    }

    this.messageService.clear();

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
    var number = control.get('streetNumber').value;
    var zip = control.get('zip').value;
    var city = control.get('city').value;
    var country = control.get('isoCountryCode').value;

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
        control.get('isoCountryCode').setErrors({
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
    return (this.personDetailForm.get('type').value.value === 'NATURAL');
  }

  setEmptyToNull(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(name => {

      if (formGroup.controls[name] instanceof FormGroup) {

        this.setEmptyToNull(formGroup.controls[name] as FormGroup);

      } else if (formGroup.controls[name].value || formGroup.controls[name].value === "") {

        if (typeof formGroup.controls[name].value === "string") {

          if (formGroup.controls[name].value === "") {
            console.log('set value to null: ' + formGroup.controls[name]);
            formGroup.controls[name].setValue(null);
          }
        }
      }
    });
  }

  loadPerson(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.personService.getPerson(id)
      .subscribe(person => {
        this.personDetailForm.get('id').setValue(person.id);
        this.personDetailForm.get('type').setValue(this.types.filter(t => t.value === person.type)[0]);

        this.personDetailForm.get('firstName').setValue(person.basicData.name.firstName);
        this.personDetailForm.get('lastNameOrCompanyName').setValue(person.basicData.name.lastNameOrCompanyName);
        if (person.basicData.birthDate != null) {
          this.birthDateControl.setValue(_moment(person.basicData.birthDate));
        }
        //this.personDetailForm.get('birthDate').setValue(this.person.basicData.birthDate);
        this.personDetailForm.get('sex').setValue(this.sexes.filter(s => s.value === person.basicData.sex)[0]);

        this.personDetailForm.get('phoneNumber').setValue(person.contactData.phoneNumber);
        this.personDetailForm.get('emailAddress').setValue(person.contactData.emailAddress);

        this.personDetailForm.get('address').get('street').setValue(person.streetAddress.street);
        this.personDetailForm.get('address').get('streetNumber').setValue(person.streetAddress.streetNumber);
        this.personDetailForm.get('address').get('zip').setValue(person.streetAddress.zip);
        this.personDetailForm.get('address').get('city').setValue(person.streetAddress.city);
        this.personDetailForm.get('address').get('isoCountryCode').setValue(this.countries.filter(c => c.Code === person.streetAddress.isoCountryCode)[0]);
      });
  }

  goBack(): void {
    this.location.back();
  }

  isNew() {
    const id = this.route.snapshot.paramMap.get('id');
    return isNil(id);
  }


  isEmptyStreetAddress(address: StreetAddress) {
    return (isNil(address.street) && isNil(address.city) && isNil(address.state) && isNil(address.streetNumber) && isNil(address.zip));
  }

  isEmptyContactData(contactData: ContactData) {
    return (isNil(contactData.emailAddress) && isNil(contactData.phoneNumber));
  }

  save(f: NgForm): void {

    console.log("save: " + f);
    this.setEmptyToNull(this.personDetailForm);

    this.messageService.clear();

    if (!this.personDetailForm.valid) {
      return;
      // this.restService.create(this.form.value)
      //   .subscribe(
      //     entry => this.handleSubmitSuccess(entry),
      //     error => this.handleSubmitError(error)
      //   );
    }

    const personToBeSaved = new Person();

    personToBeSaved.id = this.personDetailForm.get('id').value;
    personToBeSaved.type = this.personDetailForm.get('type').value.value;

    // basic data
    personToBeSaved.basicData = new BasicData();
    personToBeSaved.basicData.name = new Name();

    personToBeSaved.basicData.name.lastNameOrCompanyName = this.personDetailForm.get('lastNameOrCompanyName').value as string;

    if (personToBeSaved.type === "NATURAL") {
      personToBeSaved.basicData.name.firstName = this.personDetailForm.get('firstName').value;

      if (this.personDetailForm.get('sex').value) {
        personToBeSaved.basicData.sex = this.personDetailForm.get('sex').value.value;
      }

      if (!isNullOrUndefined(this.birthDateControl.value)) {
        var formattedLocalDate = _moment(this.birthDateControl.value).local(true).format(_moment.HTML5_FMT.DATE);
        personToBeSaved.basicData.birthDate = formattedLocalDate;
      }
    }

    // contact data
    var contactData = new ContactData();
    contactData.emailAddress = this.personDetailForm.get('emailAddress').value as string;
    contactData.phoneNumber = this.personDetailForm.get('phoneNumber').value as string;
    if (!this.isEmptyContactData(contactData)) {
      personToBeSaved.contactData = contactData;
    }

    // street address
    var streetAddress = new StreetAddress();
    streetAddress.street = this.personDetailForm.get('address').get('street').value as string;
    streetAddress.streetNumber = this.personDetailForm.get('address').get('streetNumber').value as string;
    streetAddress.zip = this.personDetailForm.get('address').get('zip').value as string;
    streetAddress.city = this.personDetailForm.get('address').get('city').value as string;
    streetAddress.isoCountryCode = this.personDetailForm.get('address').get('isoCountryCode').value.Code;
    if (!this.isEmptyStreetAddress(streetAddress)) {
      personToBeSaved.streetAddress = streetAddress;
    }

    console.log("about to save: " + JSON.stringify(personToBeSaved));

    this.personDetailForm.get('type').disable();

    this.personService.updatePerson(personToBeSaved).subscribe({
      complete: () => window.scroll(0,0),
      error: _ => window.scroll(0,0),
    });
  }
}
