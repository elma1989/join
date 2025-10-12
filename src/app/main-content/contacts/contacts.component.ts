import { Component, inject } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { FireContactService } from '../../shared/services/fire-contact.service';
import { ContactService } from '../../shared/services/contact.service';
import { AsyncPipe } from '@angular/common';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    ContactDetailComponent,
    AsyncPipe
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  fireContactService : FireContactService = inject(FireContactService);
  cs: ContactService = inject(ContactService);
  dss: DisplaySizeService = inject(DisplaySizeService);
  DisplayType = DisplayType;
}
