import { Component, inject } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { AsyncPipe } from '@angular/common';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';

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
  protected fireDB: FirebaseDBService = inject(FirebaseDBService);
  protected dss: DisplaySizeService = inject(DisplaySizeService);
  DisplayType = DisplayType;
}
