import { Component, input, InputSignal} from '@angular/core';
import { Contact } from '../classes/contact';
import { ContactIconComponent } from "../contact-icon/contact-icon.component";

@Component({
  selector: 'app-contact-icon-list',
  imports: [ContactIconComponent],
  templateUrl: './contact-icon-list.component.html',
  styleUrl: './contact-icon-list.component.scss'
})
export class ContactIconListComponent {

  public contacts: InputSignal<Contact[]> = input.required<Contact[]>();
}
