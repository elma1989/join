import { Component, input } from '@angular/core';
import { Contact } from '../../../../../shared/classes/contact';
import { ContactIconComponent } from '../../../contact-icon/contact-icon.component';

@Component({
  selector: 'app-single-contact',
  imports: [
    ContactIconComponent
  ],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss'
})
export class SingleContactComponent {
  contact = input.required<Contact>();  
}
