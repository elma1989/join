import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { CustomValidator } from '../../shared/classes/custom-validator';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/classes/user';
import { AuthService } from '../../shared/services/auth.service';
import { Contact } from '../../shared/classes/contact';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'section[sign-up]',
  imports: [
    ReactiveFormsModule,
    CommonModule
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy{
  // #region Attributes
  private fb: FormBuilder = inject(FormBuilder);
  private val: ValidationService = inject(ValidationService);
  private auth: AuthService = inject(AuthService);
  private fs: Firestore = inject(Firestore);

  private subFromChanges!: Subscription;

  protected form: FormGroup = this.fb.group({
    firstname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    lastname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    email: ['', [CustomValidator.strictRequired(), Validators.email, Validators.minLength(10)]],
    tel: ['', [CustomValidator.strictRequired(), CustomValidator.tel(), Validators.minLength(10)]],
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
  // #endregion

  ngOnInit(): void {
    this.val.registerForm('signup', this.form);
    this.subFromChanges = this.form.valueChanges.subscribe(() => this.validate());
  }

  ngOnDestroy(): void {
    this.val.removeForm('signup');
  }

  // #region Methods
  /** Validates the form. */
  private validate() {
    this.errors = this.val.validateForm('signup');
  }

  /** Submits a form */
  protected async submitForm() {
    this.val.polluteForm('signup');
    this.validate();
    if (this.form.valid) {
      const { acceptPolicy, passwordConfirm, ...userdata } = this.form.value;
      const user = new User(userdata);
      user.group = user.firstname[0];
      await this.auth.register(user);
      await this.createContact(user as Contact);
    }
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
}
