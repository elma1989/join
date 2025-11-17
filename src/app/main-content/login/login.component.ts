import { Component } from '@angular/core';
import { HeaderSignComponent } from '../../shared/components/header-sign/header-sign.component';
import { HeaderFormComponent } from '../../shared/components/header-form/header-form.component';
import { FooterSignComponent } from '../../shared/components/footer-sign/footer-sign.component';

@Component({
  selector: 'app-login',
  imports: [
    HeaderSignComponent,
    HeaderFormComponent,
    FooterSignComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
