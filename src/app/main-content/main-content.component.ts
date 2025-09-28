import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
