import { Component, input } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { AddContactComponent } from "../../shared/add-contact/add-contact.component";
import { Contact } from '../../shared/classes/contact';
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    AddContactComponent,
    ContactDetailComponent
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  modalVisiblity: "hidden" | "visible" = "hidden";  
  kindOfModal: string = "add";

  toggleAddContactModal() {
    if(this.modalVisiblity === "hidden"){
      this.modalVisiblity = "visible";

    } else {
      this.modalVisiblity = "hidden";
      this.kindOfModal = 'add';
    }
  }

  editContact() {
    this.kindOfModal = 'edit';
    this.toggleAddContactModal();
  }
}
