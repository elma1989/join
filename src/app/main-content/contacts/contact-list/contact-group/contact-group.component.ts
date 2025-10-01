import { Component, input} from '@angular/core';
import { Contact } from '../../../../shared/classes/contact';
import { CommonModule } from '@angular/common';
import { SingleContactComponent } from './single-contact/single-contact.component';
import { FireContactService } from '../../../../shared/services/fire-contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-group',
  imports: [
    CommonModule,
    SingleContactComponent
  ],
  templateUrl: './contact-group.component.html',
  styleUrl: './contact-group.component.scss'
})
export class ContactGroupComponent {
  public letter = input.required<string>();
  private allContacts: Contact[] = [];

  constructor(private fcs: FireContactService) {}

  // getMembers(): Observable<Contact[]> {
  //   return this.fcs.getMembers(this.letter());
  // }


  /**
   * Gets contacts of group.
   * @returns - List with contacts oof group.
   */
  getContacts():Contact[] {
    // this.fcs.subGroupContactList('M');
    // return this.fcs.getMembers();
    return [];
  }

  /**
   * Selects a contact.
   * @param selectedContact - Contact, which has been selected.
   */
  select(selectedContact:Contact):void {
    for(let i = 0; i < this.allContacts.length; i++) {
      this.allContacts[i].selected = false;
      if (this.allContacts[i].equals(selectedContact)) {
        this.allContacts[i].selected = true;
        this.fcs.currentContact = selectedContact;
      }
    }
  }
}
