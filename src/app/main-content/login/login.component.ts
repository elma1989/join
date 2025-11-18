import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { HeaderSignComponent } from '../../shared/components/header-sign/header-sign.component';
import { HeaderFormComponent } from '../../shared/components/header-form/header-form.component';
import { FooterSignComponent } from '../../shared/components/footer-sign/footer-sign.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SectionType } from '../../shared/enums/section-type';
import { User } from '../../shared/classes/user';
import { AuthService } from '../../shared/services/auth.service';
import { LoginData } from '../../shared/interfaces/login-data';
import { ToastMsgService } from '../../shared/services/toast-msg.service';

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

  user: OutputEmitterRef<User | null> = output<User | null>();
  section: OutputEmitterRef<SectionType> = output<SectionType>();
  prevSection: OutputEmitterRef<SectionType> = output<SectionType>();

  auth: AuthService = inject(AuthService);
  tms: ToastMsgService = inject(ToastMsgService);

  private fb: FormBuilder = inject(FormBuilder);

  protected form: FormGroup = this.fb.group({
    email: [''],
    password: ['']
  });

  protected passwordVisible: boolean = false;
  protected SectionType = SectionType;

  /** Turns visibility of password on and off. */
  protected toggleVisibility():void { this.passwordVisible = !this.passwordVisible };

  protected async submitForm(): Promise<void> {
    try {
      const userCred = await this.auth.login(this.form.value as LoginData);
      if (userCred.user) {
        const user: User | null = await this.auth.getUser(userCred.user.uid);
        if (user) {
          this.user.emit(user);
          this.section.emit(SectionType.SUMMARY);
          this.prevSection.emit(SectionType.SUMMARY);
          this.tms.add('Login successful', 3000, 'success');
          localStorage.setItem('uid', user.id);
        }
      }
    } catch (err) {
      this.tms.add('E-Mail or password is not correct', 3000, 'error');
      this.form.reset();
    }
  }

  /**
   * Navigates to a section.
   * @param section Section to navigate.
   */
  protected navigate(section: SectionType): void {
    this.section.emit(section);
    this.prevSection.emit(SectionType.LOGIN);
  }

  /** A Login for guests. */
  protected useGuestLogin(): void {
    this.user.emit(null);
    this.section.emit(SectionType.SUMMARY);
    this.prevSection.emit(SectionType.SUMMARY);
  }
}
