export class Contact {

  public name: Name;
  public phoneNumber: string;
  public emailAddress: string;
  public sex: string;
  public birthDate: string;
  public contactType: string;
  public contactId: string;
  public streetAddress: StreetAddress;

  equals(): boolean {
    return true;
  }
}

export class Name {
  public lastNameOrCompanyName: string;
  public firstName: string;
}

export class StreetAddress {
  public street: string;
  public streetNumber: string;
  public zip: string;
  public city: string;
  public isoCountryCode: string;
  public state: string;
}
