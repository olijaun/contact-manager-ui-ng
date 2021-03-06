export class Members {
  public members: Member[] = [];
}

export class Member {
  public id: string;
  public firstName: string;
  public lastNameOrCompanyName: string;
  public address: string;
  public subscriptions: Subscription[] = [];
}

export class Subscription {
  public id: string;
  public memberId: string;
  public subscriptionPeriodId: string;
  public subscriptionTypeId: string;
}

export class SubscriptionTypes {
  public subscriptionTypes: SubscriptionType[] = [];

  public findById(subscriptionTypeId: string): SubscriptionType {
    return this.subscriptionTypes.filter(st => st.id === subscriptionTypeId)[0];
  }
}

export class SubscriptionType {
  public id: string;
  public name: string;
  public amount: number;
  public currency: string;
  public maxSubscribers: number;
  public subscriptionPeriodId: string;
  public membershipTypeId: string;
}

export class SubscriptionPeriods {
  public subscriptionPeriods: SubscriptionPeriod[] = [];

  public findById(subscriptionPeriodId: string): SubscriptionPeriod {
    return this.subscriptionPeriods.filter(sp => sp.id === subscriptionPeriodId)[0];
  }
}

export class SubscriptionPeriod {
  public id: string;
  public startDate: string;
  public endDate: string;
  public name: string;
  public description: string;

  public subscriptionTypes: SubscriptionType[];
}
