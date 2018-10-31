import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Member, Subscription, SubscriptionPeriods, SubscriptionTypes} from "../member";
import {MemberService} from "../member.service";
import {UUID} from "angular2-uuid";
import {isNull} from "util";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  displayedColumns = ['id', 'subscriptionTypeId', 'subscriptionPeriodId'];
  newSubscription: Subscription;
  subscriptionPeriods: SubscriptionPeriods;
  subscriptionTypes: SubscriptionTypes;

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location
  ) {

    this.member = new Member();
    this.newSubscription = new Subscription();

    var sub1 = new Subscription();
    sub1.id = "123";
    sub1.subscriptionTypeId = "type";
    sub1.subscriptionPeriodId = "period";
    sub1.memberId = "mbr";

    this.member.subscriptions = [sub1];
    this.subscriptionPeriods = new SubscriptionPeriods();
    this.subscriptionTypes = new SubscriptionTypes();
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.loadMember();
    this.loadSubscriptionPeriods();
    this.loadSubscriptionTypes();
  }

  loadMember(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.memberService.getMember(id)
      .subscribe(member => {
        this.member = member;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }

  loadSubscriptionTypes(): void {

    if(isNull(this.newSubscription.subscriptionPeriodId)) {
      return;
    }

    this.memberService.getSubscriptionTypes(this.newSubscription.subscriptionPeriodId)
      .subscribe(subscriptionTypes => {
        this.subscriptionTypes = subscriptionTypes;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }

  addSubscription(): void {

    this.newSubscription.id = UUID.UUID();
    this.newSubscription.memberId = this.member.id;
    this.newSubscription.subscriptionPeriodId

    this.member.subscriptions = [...this.member.subscriptions, this.newSubscription];


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
}
