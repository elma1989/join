import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'header[form]',
  imports: [
    CommonModule
  ],
  templateUrl: './header-form.component.html',
  styleUrl: './header-form.component.scss'
})
export class HeaderFormComponent {

  title: InputSignal<string> = input.required<string>();

}
