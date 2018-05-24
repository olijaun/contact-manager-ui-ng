import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import {Contact} from '../contact';
import {ContactService} from '../contact.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.css']
})
export class ContactSearchComponent implements OnInit {
  contacts$: Observable<Contact[]>;
  private searchTerms = new Subject<string>();

  displayedColumns = ['contactId', 'firstName', 'lastNameOrCompanyName'];

  constructor(private contactService: ContactService, private location: Location, private router: Router) {
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.contacts$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.contactService.searchContacts(term)),
    );
  }

  rowClicked(clickedContact: Contact): void {
    console.log(clickedContact.contactId);
    this.router.navigateByUrl('/detail/1'); // TODO: why does location.go not work?
    // this.location.go('/detail/' + clickedContact.contactId);
  }
}
