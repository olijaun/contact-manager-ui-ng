import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {NgForm} from "@angular/forms";
import {
  Member,
  Subscription,
  SubscriptionPeriod,
  SubscriptionPeriods,
  SubscriptionType,
  SubscriptionTypes
} from "../member";
import {MemberService} from "../member.service";
import {UUID} from "angular2-uuid";
import {isNull, isNullOrUndefined} from "util";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  // displayedColumns = ['id', 'subscriptionTypeId', 'subscriptionPeriodId'];
  displayedColumns = ['id', 'subscriptionPeriodId', 'subscriptionTypeId'];
  selectedPeriod: SubscriptionPeriod;
  selectedSubscriptionType: SubscriptionType;
  subscriptionPeriods: SubscriptionPeriods;

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location
  ) {

    this.member = new Member();
    this.member.subscriptions = [];

    this.selectedPeriod = new SubscriptionPeriod();
    this.selectedSubscriptionType = new SubscriptionType();

    this.subscriptionPeriods = new SubscriptionPeriods();
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.loadMember();
    this.loadSubscriptionPeriods();
  }

  loadMember(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.memberService.getMember(id)
      .subscribe(member => {
        this.member = member;
      });
  }

  subscriptionPeriodById(subscriptionPeriodId : string): SubscriptionPeriod {

    // not a function: why?
    //var period = this.subscriptionPeriods.bla(subscriptionPeriodId);

    var periods = this.subscriptionPeriods.subscriptionPeriods.filter(sp => sp.id === subscriptionPeriodId);
    if(periods.length === 0) {
      return null;
    }
    return periods[0];
  }

  subscriptionPeriodNameById(subscriptionPeriodId : string): string {

    // not a function: why?
    //var period = this.subscriptionPeriods.bla(subscriptionPeriodId);
    //console.log("subscriptionPeriodNameById: " + subscriptionPeriodId);
    var period = this.subscriptionPeriodById(subscriptionPeriodId);
    if(isNullOrUndefined(period)) {
      return "?";
    }
    return period.name;
  }

  subscriptionTypeNameById(subscriptionType : SubscriptionType): string {

    console.log("subscriptionTypeNameById: " + subscriptionType.id + ", period: " + subscriptionType.subscriptionPeriodId);

    if(isNullOrUndefined(subscriptionType)) {
      return "1?";
    }

    var period = this.subscriptionPeriodById(subscriptionType.subscriptionPeriodId);
    if(isNullOrUndefined(period)) {
      return "2?";
    }
    var subscriptionTypes = period.subscriptionTypes.filter(t => t.id == subscriptionType.id);
    if(subscriptionTypes.length === 0) {
      return "3?";
    }
    return subscriptionTypes[0].name;
  }

  subscriptionTypes(): SubscriptionType[] {

    var period = this.subscriptionPeriodById(this.selectedPeriod.id);
    if(isNullOrUndefined(period)) {
      return [];
    }

    return period.subscriptionTypes;
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }

  addSubscription(): void {

    // var newSubscription = new Subscription();
    // newSubscription.id = UUID.UUID();
    // newSubscription.memberId = this.member.id;
    // newSubscription.
    //
    // this.member.subscriptions = [...this.member.subscriptions, newSubscription];
    //
    //
    // console.log("subscriptions: " + this.member.subscriptions);
  }


  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.memberService.updateMember(this.member).subscribe();
    console.log('saved member: ' + this.member);
  }

  bla(error: any): void {

  }
}
