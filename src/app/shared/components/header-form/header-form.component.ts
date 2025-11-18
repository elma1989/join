import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { SectionType } from '../../enums/section-type';

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
  section: OutputEmitterRef<SectionType> = output<SectionType>();

  protected goToLogin() {
    this.section.emit(SectionType.LOGIN);
  }
}
