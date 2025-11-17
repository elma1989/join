import { Component, input } from '@angular/core';
import { MobileNavItemData } from '../../../main-content/aside/aside.component';

@Component({
  selector: 'app-mobile-nav-item',
  standalone: true,
  imports: [],
  templateUrl: './mobile-nav-item.component.html',
  styleUrl: './mobile-nav-item.component.scss'
})
export class MobileNavItemComponent {

  item = input.required<MobileNavItemData>()

}
