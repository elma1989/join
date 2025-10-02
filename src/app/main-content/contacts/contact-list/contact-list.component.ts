import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactGroupComponent } from './contact-group/contact-group.component';
import { FireContactService } from '../../../shared/services/fire-contact.service';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    ContactGroupComponent
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {

  constructor(private fcs:FireContactService) {}

  /** Gets Groups from FireContactService */
  getGroups():string[] {
    return this.fcs.getGroups();
  }
}
