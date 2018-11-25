import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Location} from "@angular/common";
import {Member, SubscriptionPeriod} from "../member";
import {MemberService} from "../member.service";
import {MemberSearchCriteria} from "./MemberSearchCriteria";
import {isNullOrUndefined} from "util";
import {MessageService} from "../message.service";
import {Sort} from "@angular/material";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.css']
})
export class MemberSearchComponent implements OnInit {

  members$: Observable<Member[]>;
  private searchTerms = new Subject<MemberSearchCriteria>();
  subscriptionPeriods: SubscriptionPeriod[];
  selectedPeriod: SubscriptionPeriod;
  searchTerm: string;
  searchCriteria = new MemberSearchCriteria();

  //displayedColumns = ['id', 'firstName', 'lastNameOrCompanyName'];
  displayedColumns = ['id', 'lastNameOrCompanyName', 'firstName', 'address', 'subscriptionType'];

  constructor(private memberService: MemberService, private messageService: MessageService, private location: Location, private router: Router) {
    this.subscriptionPeriods = [];
    this.selectedPeriod = new SubscriptionPeriod();
    this.selectedPeriod.id = "";
    this.searchTerm = "";

    this.searchCriteria.searchString = "";
    this.searchCriteria.periodId = "";
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    console.log('search term: ' + term);
    this.searchCriteria.searchString = term;

    var c = new MemberSearchCriteria();
    c.searchString = this.searchCriteria.searchString;
    c.periodId = this.searchCriteria.periodId;

    this.searchTerms.next(c);
  }

  ngOnInit(): void {

    this.messageService.clear();

    this.members$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: MemberSearchCriteria) => this.memberService.searchMembers(term)),
    );

    this.loadSubscriptionPeriods();
  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      return;
    }

    console.log('search order changed');
    var c = new MemberSearchCriteria();
    c.searchString = this.searchCriteria.searchString;
    c.periodId = this.searchCriteria.periodId;
    c.ascending = sort.direction === 'asc';
    c.sortBy = sort.active;
    this.searchTerms.next(c);
  }

  rowClicked(clickedMember: Member): void {
    console.log(clickedMember.id);
    this.router.navigateByUrl('/member-detail/' + clickedMember.id); // TODO: why does location.go not work?
    // this.location.go('/detail/' + clickedContact.contactId);
  }

  periodChanged(period: SubscriptionPeriod): void {
    // this.searchCriteria.periodId = period.id;
    // this.searchTerms.next(this.searchCriteria);
    var c = new MemberSearchCriteria();
    c.searchString = this.searchCriteria.searchString;
    c.periodId = period.id;
    this.searchTerms.next(c);
    console.log('period changed');
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
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

  subscriptionNameByMember(member: Member): string {

    if (isNullOrUndefined(member)) {
      return "?";
    }

    var period = this.selectedPeriod;
    if (isNullOrUndefined(period)) {
      return "?";
    }

    var subscriptions = member.subscriptions.filter(s => s.subscriptionPeriodId === this.selectedPeriod.id);

    if (subscriptions.length == 0) {
      return "?";
    }
    // TODO: a user might have multiple subscriptions for the same period in theory
    var subscription = subscriptions[0];

    var subscriptionTypes = period.subscriptionTypes.filter(t => t.id === subscription.subscriptionTypeId);

    if (subscriptionTypes.length === 0) {
      return "?";
    }
    return subscriptionTypes[0].name;
  }
}
