import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import {MemberService} from "../member.service";
import {MessageService} from "../message.service";
import {MemberSearchCriteria} from "../member-search/MemberSearchCriteria";
import {PersonService} from "../person.service";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(private memberService: MemberService, private personService: PersonService, private messageService: MessageService) { }

  ngOnInit() {
  }

  exportMembers() : void {

    const searchCriteria = new MemberSearchCriteria();

    console.log("searchCriteria: " + JSON.stringify(searchCriteria));

    searchCriteria.searchString = "";
    searchCriteria.periodId = ""
    searchCriteria.ascending = true;
    searchCriteria.sortBy = "lastNameOrCompanyName";

    this.memberService.exportCsv(searchCriteria).subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'text/csv' });
        saveAs(blob, "test.csv");
      }
    );
  }

  exportPersons() : void {

    this.personService.exportCsv().subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'text/csv' });
        saveAs(blob, "test.csv");
      }
    );
  }
}
