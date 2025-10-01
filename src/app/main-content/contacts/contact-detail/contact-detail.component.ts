import { Component, input, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';

@Component({
  selector: 'app-contact-detail',
  imports: [ContactIconComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {
  // contact = input.required<Contact>();
  
  contact = new Contact({id:'', firstName:'Anton', lastName:'Mayer', group:'A', email:'antonm@gmail.com',tel: '0171 123456789', iconColor:null});
  private firestore: Firestore = inject(Firestore);

  addContactModalVisiblity: "hidden" | "visible" = "hidden";

  toggleEditContactModal() {
    // console.log('Add contact');
    if(this.addContactModalVisiblity === "hidden"){
      this.addContactModalVisiblity = "visible";

    } else {
      this.addContactModalVisiblity = "hidden";
    }
  }

  deleteContact() {
    // inputfields values
    // set contact
    // add to firestore
  }
}
