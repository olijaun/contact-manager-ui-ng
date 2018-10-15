export class Member {
  public id: string;
  public type: string;
  public basicData: BasicData = new BasicData();
  public contactData: ContactData = new ContactData();
  public streetAddress: StreetAddress = new StreetAddress();
}

export class BasicData {
  public name: Name = new Name();
  public sex: string;
  public birthDate: string;
}

export class ContactData {
  public phoneNumber: string;
  public emailAddress: string;
}

export class Name {
  public firstName: string;
  public lastNameOrCompanyName: string;
}

export class StreetAddress {
  public street: string;
  public streetNumber: string;
  public zip: string;
  public city: string;
  public isoCountryCode: string;
  public state: string;
}
