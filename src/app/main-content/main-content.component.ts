import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { ContactsComponent } from './contacts/contacts.component';

@Component({
  selector: 'app-main-section',
  imports: [
    HeaderComponent,
    ContactsComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
