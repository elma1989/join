import { Component } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { Contact } from '../../shared/classes/contact';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    ContactDetailComponent
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  selectedContact!: Contact;

}
