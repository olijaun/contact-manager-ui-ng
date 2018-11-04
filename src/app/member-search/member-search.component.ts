import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Location} from "@angular/common";
import {Member, SubscriptionPeriod, SubscriptionPeriods} from "../member";
import {MemberService} from "../member.service";

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.css']
})
export class MemberSearchComponent implements OnInit {

  members$: Observable<Member[]>;
  private searchTerms = new Subject<string>();
  subscriptionPeriods: SubscriptionPeriods;
  selectedPeriod: SubscriptionPeriod;
  searchTerm: string;

  //displayedColumns = ['id', 'firstName', 'lastNameOrCompanyName'];
  displayedColumns = ['firstName', 'lastNameOrCompanyName', 'address'];

  constructor(private memberService: MemberService, private location: Location, private router: Router) {
    this.subscriptionPeriods = new SubscriptionPeriods();
    this.selectedPeriod = new SubscriptionPeriod();
    this.selectedPeriod.id = "";
    this.searchTerm = "";
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.members$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.memberService.searchMembers(term, this.selectedPeriod.id)),
    );

    this.loadSubscriptionPeriods();
  }

  rowClicked(clickedMember: Member): void {
    console.log(clickedMember.id);
    this.router.navigateByUrl('/member-detail/' + clickedMember.id); // TODO: why does location.go not work?
    // this.location.go('/detail/' + clickedContact.contactId);
  }

  periodChanged(period: SubscriptionPeriod): void {
    this.searchTerms.next(this.searchTerm);
    //this.members$ = this.memberService.searchMembers(this.searchTerm, this.selectedPeriod.id);
  }

  loadSubscriptionPeriods(): void {

    this.memberService.getSubscriptionPeriods()
      .subscribe(subscriptionPeriods => {
        this.subscriptionPeriods = subscriptionPeriods;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
  }
}
