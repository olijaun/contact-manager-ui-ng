import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Member, Subscription, SubscriptionPeriod, SubscriptionType} from "../member";
import {MemberService} from "../member.service";
import {UUID} from "angular2-uuid";
import {isNullOrUndefined} from "util";
import {tap} from "rxjs/operators";
import {MessageService} from "../message.service";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  // displayedColumns = ['id', 'subscriptionTypeId', 'subscriptionPeriodId'];
  displayedColumns = ['subscriptionPeriodId', 'subscriptionTypeId'];
  subscriptionPeriods: SubscriptionPeriod[];
  membershipForm: FormGroup;
  subscriptionPeriod: FormControl = new FormControl(null, [Validators.required]);
  subscriptionType: FormControl = new FormControl(null, [Validators.required]);
  unsavedSubscriptions: Subscription[] = [];
  currentSubscriptionTypes: SubscriptionType[] = [];

  isAddButtonActivated: boolean = false;

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.member = new Member();
    this.member.subscriptions = [];

    this.subscriptionPeriods = [];
    this.membershipForm = this.fb.group({
      subscriptionPeriod: this.subscriptionPeriod,
      subscriptionType: this.subscriptionType
    });

    this.membershipForm.get('subscriptionPeriod').valueChanges.subscribe(val => {
      this.currentSubscriptionTypes = (val as SubscriptionPeriod).subscriptionTypes;
      this.isAddButtonActivated = this.notAddedYet();
    });

    this.membershipForm.get('subscriptionType').valueChanges.subscribe(val => {
      this.isAddButtonActivated = this.notAddedYet();
      console.log("add button activated: " + this.isAddButtonActivated);
    });
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.messageService.clear();
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

  subscriptionPeriodNameById(subscriptionPeriodId: string):
    string {

    // not a function: why?
    //var period = this.subscriptionPeriods.bla(subscriptionPeriodId);
    //console.log("subscriptionPeriodNameById: " + subscriptionPeriodId);
    var period = this.subscriptionPeriodById(subscriptionPeriodId);
    if (isNullOrUndefined(period)) {
      return "?";
    }
    return period.name;
  }

  subscriptionTypeNameById(subscription: Subscription):
    string {

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

    if (!this.membershipForm.get('subscriptionType').value) {
      return [];
    }

    var period = this.subscriptionPeriodById(this.membershipForm.get('subscriptionType').value.id);
    console.log('subscriptionTypes: ' + period);
    if (isNullOrUndefined(period)) {
      return [];
    }
    console.log('subscriptionTypes: ' + period.id);
    return period.subscriptionTypes;
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .pipe(
        tap(s => console.log("received object: " + JSON.stringify(s))),
      )
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
      });
  }

  addSubscription(): void {

    var newSubscription = new Subscription();
    newSubscription.id = UUID.UUID();
    newSubscription.memberId = this.member.id;
    newSubscription.subscriptionPeriodId = this.membershipForm.get('subscriptionPeriod').value.id;
    newSubscription.subscriptionTypeId = this.membershipForm.get('subscriptionType').value.id;

    this.unsavedSubscriptions = [...this.unsavedSubscriptions, newSubscription];


    this.isAddButtonActivated = this.notAddedYet();
  }

  notAddedYet(): boolean {

    const selectedSubscriptionType: SubscriptionType = this.membershipForm.get('subscriptionType').value;
    console.log("selectedSubscriptionType" + JSON.stringify(selectedSubscriptionType));
    if (!selectedSubscriptionType) {
      return false;
    }

    const sameTypes = this.member.subscriptions //
      .filter(t => t.subscriptionPeriodId === selectedSubscriptionType.subscriptionPeriodId //
        && t.subscriptionTypeId === selectedSubscriptionType.id);

    console.log(":::: " + JSON.stringify(sameTypes));
    console.log(":::: not added yet: " + (sameTypes.length === 0));
    return sameTypes.length === 0;
  }

  goBack(): void {
    this.location.back();
  }

  save(f: NgForm):
    void {

    if (!
      this.membershipForm.valid
    ) {
      return;
    }

    const updatedMember = new Member();

    updatedMember.subscriptions = this.member.subscriptions
    this.memberService.updateMember(this.member).subscribe();
    console.log('saved member: ' + this.member);
  }

  editPersonClicked() {
    this.router.navigateByUrl('/person-detail/' + this.member.id); // TODO: why does location.go not work?
  }
}
