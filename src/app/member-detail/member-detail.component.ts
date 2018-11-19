import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Member, Subscription, SubscriptionPeriod, SubscriptionType} from "../member";
import {MemberService} from "../member.service";
import {UUID} from "angular2-uuid";
import {isNullOrUndefined} from "util";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  // displayedColumns = ['id', 'subscriptionTypeId', 'subscriptionPeriodId'];
  displayedColumns = ['subscriptionPeriodId', 'subscriptionTypeId'];
  selectedPeriod: SubscriptionPeriod;
  selectedSubscriptionType: SubscriptionType;
  subscriptionPeriods: SubscriptionPeriod[];

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location,
    private router: Router
  ) {

    this.member = new Member();
    this.member.subscriptions = [];

    this.selectedPeriod = new SubscriptionPeriod();
    this.selectedSubscriptionType = new SubscriptionType();

    this.subscriptionPeriods = [];
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

  subscriptionPeriodById(subscriptionPeriodId: string): SubscriptionPeriod {

    // not a function: why?
    //var period = this.subscriptionPeriods.bla(subscriptionPeriodId);

    var periods = this.subscriptionPeriods.filter(sp => sp.id === subscriptionPeriodId);
    if (periods.length === 0) {
      return null;
    }
    return periods[0];
  }

  subscriptionPeriodNameById(subscriptionPeriodId: string): string {

    // not a function: why?
    //var period = this.subscriptionPeriods.bla(subscriptionPeriodId);
    //console.log("subscriptionPeriodNameById: " + subscriptionPeriodId);
    var period = this.subscriptionPeriodById(subscriptionPeriodId);
    if (isNullOrUndefined(period)) {
      return "?";
    }
    return period.name;
  }

  subscriptionTypeNameById(subscription: Subscription): string {

    if (isNullOrUndefined(subscription)) {
      return "?";
    }

    var period = this.subscriptionPeriodById(subscription.subscriptionPeriodId);
    if (isNullOrUndefined(period)) {
      return "?";
    }

    var subscriptionTypes = period.subscriptionTypes.filter(t => t.id === subscription.subscriptionTypeId);

    if (subscriptionTypes.length === 0) {
      return "?";
    }
    return subscriptionTypes[0].name;
  }

  subscriptionTypes(): SubscriptionType[] {

    var period = this.subscriptionPeriodById(this.selectedPeriod.id);
    if (isNullOrUndefined(period)) {
      return [];
    }

    return period.subscriptionTypes;
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .pipe(
        tap(s => console.log("received object: " + JSON.stringify(s))),
        )
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }

  addSubscription(): void {

    var newSubscription = new Subscription();
    newSubscription.id = UUID.UUID();
    newSubscription.memberId = this.member.id;
    newSubscription.subscriptionPeriodId = this.selectedPeriod.id;
    newSubscription.subscriptionTypeId = this.selectedSubscriptionType.id;

    console.log("newSubscription: " + JSON.stringify(newSubscription));

    this.member.subscriptions = [...this.member.subscriptions, newSubscription];


    console.log("subscriptions: " + this.member.subscriptions);
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

  editPersonClicked() {
    this.router.navigateByUrl('/person-detail/' + this.member.id); // TODO: why does location.go not work?
  }
}
