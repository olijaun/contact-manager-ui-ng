export class Contact {
  name: Name;
  phoneNumber: string;
  emailAddress: string;
  sex: string;
  birthDate: string;
  contactType: string;
  contactId: string;
  streetAddress: StreetAddress;
}

export class Name {
  lastNameOrCompanyName: string;
  firstName: string;
}

export class StreetAddress {
  street: string;
  streetNumber: string;
  zip: string;
  city: string;
  isoCountryCode: string;
  state: string;
}
