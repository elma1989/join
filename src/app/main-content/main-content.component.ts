import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AsideComponent } from "./../../app/main-content/aside/aside.component";

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    ContactsComponent,
    AsideComponent
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
