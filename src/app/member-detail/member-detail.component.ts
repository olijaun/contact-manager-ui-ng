import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Member, Subscription} from "../member";
import {MemberService} from "../member.service";
import {MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  displayedColumns = ['id', 'subscriptionTypeId', 'subscriptionPeriodId'];

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location
  ) {

    this.member = new Member();

    var sub1 = new Subscription();
    sub1.id = "123";
    sub1.subscriptionTypeId ="type";
    sub1.subscriptionPeriodId = "period";
    sub1.memberId = "mbr";

    this.member.subscriptions = [ sub1 ];

  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.loadMember();
  }

  loadMember(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.memberService.getMember(id)
      .subscribe(member => {
        this.member = member;
        //this.subscriptionsDataSource = new MatTableDataSource<Subscription>(this.member.subscriptions)
      });
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
