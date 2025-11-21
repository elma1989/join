import { Component, HostListener, inject, OnDestroy } from '@angular/core';
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
    AsyncPipe, // Hinzugefügt
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnDestroy {

  windowWidth: number = window.innerWidth;

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }
  
  protected fireDB: FirebaseDBService = inject(FirebaseDBService);
  protected dss: DisplaySizeService = inject(DisplaySizeService);
  DisplayType = DisplayType;

  setContact(contact: Contact | null) {
    this.fireDB.setCurrentContact(contact); 
  }

  ngOnDestroy(): void {
    this.fireDB.setCurrentContact(null);
  }
}

//#endregion
