export class Contact {

  constructor(public name: Name,
              public phoneNumber: string,
              public emailAddress: string,
              public sex: string,
              public birthDate: string,
              public contactType: string,
              public contactId: string,
              public streetAddress: StreetAddress) {

  }

  equals(): boolean {
    return true;
  }

  clone(): Contact {
    const clonedName = this.name.clone();
    const clonedAddress = this.streetAddress.clone();
    return new Contact(clonedName, this.phoneNumber, this.emailAddress, this.sex, this.birthDate, this.contactType, this.contactId, clonedAddress);
  }
}

export class Name {
  constructor(
    public lastNameOrCompanyName: string,
    public firstName: string) {

  }

  clone(): Name {
    return new Name(this.lastNameOrCompanyName, this.firstName);
  }
}

export class StreetAddress {
  constructor(
    public street: string,
    public streetNumber: string,
    public zip: string,
    public city: string,
    public isoCountryCode: string,
    public state: string) {

  }

  clone(): StreetAddress {
    return new StreetAddress(this.street, this.streetNumber, this.zip, this.city, this.isoCountryCode, this.state);
  }
}
