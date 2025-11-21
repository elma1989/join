import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { ContactListComponent } from '../../shared/components/contact-list/contact-list.component';
import { ContactDetailComponent } from '../../shared/components/contact-detail/contact-detail.component';
import { Contact } from '../../shared/classes/contact';

//#region Component

/**
 * Component representing the Contacts section of the application.
 * 
 * This component manages the display and interaction logic for
 * the contact list and contact details. It dynamically adapts
 * the layout based on the screen size (mobile, tablet, desktop).
 */
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

  //#region Dependencies
  contact: Contact | null = null;

  contactDetail: boolean = false;
  
  /** Service providing access to Firebase database operations. */
  protected fireDB: FirebaseDBService = inject(FirebaseDBService);

  /** Service managing display behavior based on current screen size. */
  protected dss: DisplaySizeService = inject(DisplaySizeService);

  /** Enum reference for responsive display handling (e.g., Mobile, Tablet, Desktop). */
  DisplayType = DisplayType;

  setContact(contact: Contact | null) {
    this.contact = contact;
  }

  // closeContactDetail() {
  //   this.contactDetail
  // }

  //#endregion
}

//#endregion
