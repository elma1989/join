import { Component, input} from '@angular/core';
import { Contact } from '../../../../shared/classes/contact';
import { DummyContactService } from '../dummy-contact.service';
import { CommonModule } from '@angular/common';
import { SingleContactComponent } from './single-contact/single-contact.component';

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
  private allContacts: Contact[];

  // TODO: replatce Dummy
  constructor(private dcs:DummyContactService) {
    this.allContacts = dcs.contacts;
  }

  /**
   * Gets contacts of group.
   * @returns - List with contacts oof group.
   */
  getContacts():Contact[] {
    return this.dcs.getContactsByGroup(this.letter());
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
        this.dcs.selectedContact = selectedContact;
      }
    }
  }
}
