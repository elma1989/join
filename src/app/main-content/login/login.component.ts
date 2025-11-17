import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { HeaderSignComponent } from '../../shared/components/header-sign/header-sign.component';
import { HeaderFormComponent } from '../../shared/components/header-form/header-form.component';
import { FooterSignComponent } from '../../shared/components/footer-sign/footer-sign.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SectionType } from '../../shared/enums/section-type';

@Component({
  selector: 'section[login]',
  imports: [
    HeaderSignComponent,
    HeaderFormComponent,
    FooterSignComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  section: OutputEmitterRef<SectionType> = output<SectionType>();
  prevSection: OutputEmitterRef<SectionType> = output<SectionType>();

  private fb: FormBuilder = inject(FormBuilder);

  protected form: FormGroup = this.fb.group({
    email: [''],
    password: ['']
  });

  protected passwordVisible: boolean = false;
  protected SectionType = SectionType;

  /** Turns visibility of password on and off. */
  protected toggleVisibility():void { this.passwordVisible = !this.passwordVisible };

  /**
   * Navigates to a section.
   * @param section Section to navigate.
   */
  protected navigate(section: SectionType): void {
    this.section.emit(section);
    this.prevSection.emit(SectionType.LOGIN);
  }
}
