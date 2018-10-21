import {Component, OnInit, ViewChild} from '@angular/core';
import {UUID} from "angular2-uuid";
import {ContactData, Person, StreetAddress} from "../person";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PersonService} from "../person.service";
import {NgForm} from "@angular/forms";
import {Member} from "../member";
import {isNil} from 'lodash';
import {MemberService} from "../member.service";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;

  @ViewChild('basicForm') public basicForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location
  ) {

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
