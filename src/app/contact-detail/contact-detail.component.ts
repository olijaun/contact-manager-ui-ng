import {Component, Input, OnInit} from '@angular/core';
import {Contact, Name} from '../contact';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ContactService} from '../contact.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: Contact;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location
  ) {
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id === 'new') {
      this.contact = new Contact();
      this.contact.name = new Name();
    } else {
      this.getContact();
    }
  }

  getContact(): void {

    const id = +this.route.snapshot.paramMap.get('id');

    this.contactService.getContact(id)
      .subscribe(contact => this.contact = contact);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.contactService.updateContact(this.contact)
      .subscribe(() => this.goBack());
  }

}
