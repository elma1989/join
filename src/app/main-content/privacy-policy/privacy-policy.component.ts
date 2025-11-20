import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { User } from '../../shared/classes/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'section[privacy-policy]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  user: InputSignal<User | null> = input<User | null>(null);
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
