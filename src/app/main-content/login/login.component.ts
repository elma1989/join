import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../../shared/components/header-sign/header-sign.component';
import { HeaderFormComponent } from '../../shared/components/header-form/header-form.component';
import { FooterSignComponent } from '../../shared/components/footer-sign/footer-sign.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  private fb: FormBuilder = inject(FormBuilder);

  protected form: FormGroup = this.fb.group({
    email: [''],
    password: ['']
  });

  protected passwordVisible: boolean = false;

  /** Turns visibility of password on and off. */
  toggleVisibility():void { this.passwordVisible = !this.passwordVisible };

}
