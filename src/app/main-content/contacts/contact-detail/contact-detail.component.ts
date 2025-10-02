import { Component, input, inject } from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';
import { FireContactService } from '../../../shared/services/fire-contact.service';

@Component({
  selector: 'app-contact-detail',
  imports: [ContactIconComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {
  // contact = input.required<Contact>();
  
  contact = new Contact({id:'', firstName:'Anton', lastName:'Mayer', group:'A', email:'antonm@gmail.com',tel: '0171 123456789', iconColor:null});
  private firestore: FireContactService = inject(FireContactService);

  editModalState: 'closed' | 'open' = 'closed';

  toggleEditContactModal() {
    this.editModalState = this.editModalState === 'closed' ? 'open' : 'closed';
  }

  deleteContact() {
    // Hier kommt später Ihre Logik für Firestore zum Löschen des Kontakts hin
    console.log('Contact to be deleted:', this.contact); 
    this.editModalState = 'closed';
  }

  /**
   * Platzhalterfunktion zum Speichern (Aktualisieren) des Kontakts.
   */
  saveContact() {
    // Hier kommt später Ihre Logik für Firestore zum Speichern des Kontakts hin
    console.log('Contact to be saved:', this.contact);
    this.editModalState = 'closed';
  }
}
