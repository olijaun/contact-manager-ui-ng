export class Member {
  public id: string;
  public firstName: string;
  public lastNameOrCompanyName: string;
  public subscriptions: Subscription[];
}

export class Subscription {
  public id: string;
  public memberId: string;
  public subscriptionPeriodId: string;
  public subscriptionTypeId: string;
}

