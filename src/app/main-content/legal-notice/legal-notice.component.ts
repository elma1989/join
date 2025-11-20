import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { User } from '../../shared/classes/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'section[legal-notice]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  user: InputSignal<User | null> = input<User | null>(null);
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
