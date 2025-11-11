import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { CustomValidator } from '../../shared/classes/custom-validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'section[sign-up]',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy{
  // #region Attributes
  private fb: FormBuilder = inject(FormBuilder);
  private val: ValidationService = inject(ValidationService);

  private subFromChanges!: Subscription;

  protected form: FormGroup = this.fb.group({
    firstname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    lastname: ['', [CustomValidator.strictRequired(), Validators.minLength(3), CustomValidator.firstUpperCase()]],
    email: ['', [CustomValidator.strictRequired(), Validators.email, Validators.minLength(10)]],
    tel: ['', [CustomValidator.strictRequired(), CustomValidator.tel, Validators.minLength(10)]],
    password: ['', [CustomValidator.strictRequired(), Validators.minLength(10)]],
    passwordConfirm: ['', [CustomValidator.strictRequired(), Validators.minLength(10)]],
    acceptPolicy: [false]
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

  protected submitForm() {
    this.validate();
    console.log(this.errors);
  }
  // #endregion
}
