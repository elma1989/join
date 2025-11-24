import { Component, inject, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { CustomValidator } from '../../shared/classes/custom-validator';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/classes/user';
import { AuthService } from '../../shared/services/auth.service';
import { Contact } from '../../shared/classes/contact';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastMsgService } from '../../shared/services/toast-msg.service';
import { SectionType } from '../../shared/enums/section-type';
import { HeaderSignComponent } from '../../shared/components/header-sign/header-sign.component';
import { FooterSignComponent } from '../../shared/components/footer-sign/footer-sign.component';
import { HeaderFormComponent } from '../../shared/components/header-form/header-form.component';

@Component({
  selector: 'section[sign-up]',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderSignComponent,
    HeaderFormComponent,
    FooterSignComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy{
  // #region Attributes
  user: OutputEmitterRef<User> = output<User>();
  section: OutputEmitterRef<SectionType> = output<SectionType>();
  prevSection: OutputEmitterRef<SectionType> = output<SectionType>();

  private fb: FormBuilder = inject(FormBuilder);
  private val: ValidationService = inject(ValidationService);
  private auth: AuthService = inject(AuthService);
  private fs: Firestore = inject(Firestore);
  private tms: ToastMsgService = inject(ToastMsgService);

  private subFromChanges!: Subscription;

  protected form: FormGroup = this.fb.group({
    firstname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    lastname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    email: ['', [CustomValidator.strictRequired(), Validators.email, Validators.minLength(10)]],
    tel: ['', [CustomValidator.strictRequired(), Validators.minLength(10)]],
    password: ['', [CustomValidator.strictRequired(), 
      CustomValidator.includes('upperCase'), 
      CustomValidator.includes('lowerCase'), 
      CustomValidator.includes('number'), 
      CustomValidator.includes('special'), 
      Validators.minLength(10)]],
    passwordConfirm: ['', [CustomValidator.strictRequired(), this.val.confirmPassword()]],
    acceptPolicy: [false, [CustomValidator.acceptPolicy()]]
  });
  protected errors: Record<string, string[]> = {};

  protected passwordVisible: boolean = false;
  protected confirmVisible: boolean = false;
  protected SectionType = SectionType;
  // #endregion

  ngOnInit(): void {
    this.val.registerForm('signup', this.form);
    this.subFromChanges = this.form.valueChanges.subscribe(() => this.validate());
    this.load();
  }

  ngOnDestroy(): void {
    this.val.removeForm('signup');
  }

  // #region Methods
  // #region Formmanagement
  /** Submits a form */
  protected async submitForm() {
    this.val.polluteForm('signup');
    this.validate();
    if (this.form.valid) {
      const { acceptPolicy, passwordConfirm, ...userdata } = this.form.value;
      const user = new User(userdata);
      user.group = user.firstname[0].toUpperCase();
      user.tel = user.tel.trim();
      this.clear();
      localStorage.clear();
      try {
        await this.auth.register(user);
        await this.createContact(user as Contact);
        this.goToBoard(user);
        localStorage.setItem('uid', user.id);
      } catch (error) {
        this.form.reset();
        this.tms.add('User allready exists', 3000, 'error');
      }
    }
  }
  
  /** Validates the form. */
  private validate() {
    this.errors = this.val.validateForm('signup');
  }

  /**
   * Crates a contact for new user.
   * @param contact - Contact to create.
   */
  private async createContact(contact: Contact): Promise<void> {
    if (contact.id) {
      await setDoc(doc(this.fs, 'contacts', contact.id), contact.toJSON());
    }
  }
  // #endregion

  // #region Visibility
  /** Shows and hides the passord. */
  protected togglePassword() {this.passwordVisible = !this.passwordVisible;}

  /** Shows and hides the password confirm. */
  protected toggleConfirm() {this.confirmVisible = !this.confirmVisible;}
  // #endregion
  
  // #region localStorage
  /** Saves userinputs in localstrorage. */
  private save() {
    const storage: Record<string, string> = {};
    Object.keys(this.form.controls).forEach(key => {
      const child = this.form.get(key);
      if (child && child.dirty) storage[key] = child.value;
    });
    localStorage.setItem('signup', JSON.stringify(storage));
  }

  /** Loads formfields form localStorage */
  private load() {
    const storaged = localStorage.getItem('signup');
    if (storaged) {
      const json = JSON.parse(storaged);
      Object.entries(json).forEach(([key, value]) => {
        const child = this.form.get(key);
        if (child) {
          child.setValue(value);
          child.markAsDirty();
        }
      });
    }
  }

  /** Removes localStorage. */
  private clear() {
    localStorage.clear();
  }
  // #endregion

  // #region navigation
  /**
   * Changes to board.
   * @param user User, who was logged in.
   */
  private goToBoard(user: User) {
    this.tms.add('Signup successful', 3000, 'success');
    if (user) {
      this.user.emit(user);
      this.section.emit(SectionType.SUMMARY);
    }
  }

  protected navigate(section: SectionType): void{
    this.save();
    this.section.emit(section);
    this.prevSection.emit(SectionType.SIGNUP);
  }
  // #endregion
  // #endregion
}
