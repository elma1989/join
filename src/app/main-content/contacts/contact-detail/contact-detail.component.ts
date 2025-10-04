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
  contact = input.required<Contact>();

  private firestore: FireContactService = inject(FireContactService);

  editModalState: 'closed' | 'open' = 'closed';

  toggleEditContactModal() {
    this.editModalState = this.editModalState === 'closed' ? 'open' : 'closed';
  }

  deleteContact() {
    console.log('Contact to be deleted:', this.contact); 
    this.editModalState = 'closed';
  }

  saveContact() {
    console.log('Contact to be saved:', this.contact);
    this.editModalState = 'closed';
  }
}
//this.firestore.currentContact anstatt contact.
// output schreiben