import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  forms: Map<string, FormGroup> = new Map<string, FormGroup>();

  // #region Methods
  /**
   * Adds a new from for registry.
   * @param key - Key of form.
   * @param form - FromGroup, which is added.
   */
  registerForm(key: string, form: FormGroup): void {
    this.forms.set(key, form);
  }

  /**
   * Removes a form from registry.
   * Use it on ngOnDestroy in component.
   * @param key - Key for delete
   */
  removeForm(key: string): void {
    this.forms.delete(key);
  }

  /**
   * Validates a form.
   * @param formType - Type of Form.
   * @returns Record of errors.
   */
  validateForm(formType: string): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    const form: FormGroup | undefined = this.forms.get(formType);

    if (form) {
      this.collectErrors(form, errors);
    }
    return errors
  }

  /**
   * Gets all errors of a form;
   * @param formType - Name of form.
   * @returns Record of validation errors
   */
  getAllErrors(formType: string): Record<string, any> {
    const result: Record<string, any> = {};
    const form = this.forms.get(formType);

    if (form) this.validateAll(form, result)
    
    return result;
  }

  /** Checks, if confirm password matches password. */
  confirmPassword(): ValidatorFn {
    return (): ValidationErrors | null => {
      const form = this.forms.get('signup');
      if (!form) return null;
      const passwordControl = form.get('password');
      const passwordConfirmControl = form.get('passwordConfirm');
      if (!passwordControl || !passwordConfirmControl) return null;
      return passwordControl.value == passwordConfirmControl.value ? null : { confirmMissmatch: true };
    }
  }

  // #region Helper
  /**
   * Gets all errors of a FrormGroup.
   * @param control - FromGroup or FormControl to validate.
   * @param path - Path to control
   * @returns Record of valdation errors
   */
  private validateAll(control: AbstractControl, result: Record<string,any>, path: string = ''): void {

    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        const child = control.get(key);
        if (child) {
          const childPath = path ? `${path}.${key}` : key;
          this.validateAll(child, result, childPath);
        }
      })
    } else if (control instanceof FormControl) {
      if (control.errors) {
        result[path] = control.errors;
      }
    }
  }

  /**
   * Pollutes a form.
   * @param formType - Name of form.
   */
  polluteForm(formType: string): void {
    const form = this.forms.get(formType);

    if (form) this.polluteRecursively(form);
  }

  /**
   * Collects errors in forms recursively.
   * @param control - Control to check.
   * @param errors - Record of errors.
   * @param path - Path of pareent or child
   */
  private collectErrors(control: AbstractControl, errors: Record<string, string[]>, path: string = ''): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        const child = control.get(key);
        if (child) {
          const childPath = path ? `${path}.${key}` : key;
          this.collectErrors(child, errors, childPath);
        }
      });
    } else if (control instanceof FormControl) {
      this.pushErrorByControl(control, errors, path);
    }
  }

  /**
   * Pushs error from a control in the record of errors.
   * @param control - Instance of FormContol.
   * @param errors - Record of errors.
   * @param path - Path to push.
   */
  private pushErrorByControl(control: FormControl, errors: Record<string, string[]>, path: string): void {
    if (control.dirty && control.errors) {
      errors[path] = [];
      for (const errorKey in control.errors) {
        errors[path].push(this.getErrorMessage(errorKey, control.errors[errorKey]))
      }
    }
  }

  /**
   * Pollutes alle FromControls recursively.
   * @param control - Control to pollute.
   * @param path - Path of control
   */
  private polluteRecursively(control: AbstractControl, path: string = ''): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        const child = control.get(key);
        if (child) {
          const childPath = path ? `${path}.${key}` : key;
          this.polluteRecursively(child, childPath);
        }
      });
    } else if (control instanceof FormControl) {
      control.markAsDirty();
    }
  }

  /**
   * Gets an error message for user.
   * @param errorKey - Key in Error-Record
   * @param errorValue - Value of Validation (example maxLength(value))
   * @returns - Errormessage for user.
   */
  private getErrorMessage(errorKey: string, errorValue?: any): string {
    switch (errorKey) {
      case 'strictRequired':
        return 'Field is required.';

      case 'subtaskRequired':
        return 'Subtask is required, if you want to add one.';

      case 'firstUpperCase':
        return 'Use upper case at frist.';

      case 'upperCase':
        return 'Use minmal one upper case.';

      case 'lowerCase':
        return 'Use minimal one lower case';

      case 'number':
        return 'Use minimal one number.';

      case 'special':
        return 'Use minimal one special character.';

      case 'minlength':
        return `Minimal ${errorValue.requiredLength} signs required.`;

      case 'customMinLength':
        return `Minimal ${errorValue.customRequiredLength} signs required.`;

      case 'email':
        return 'E-Mail format is not correct.';

      case 'tel':
        return '';

      case 'dateFormat':
        return 'Use format: MM/DD/YYYY.';

      case 'dateInPast':
        return 'Do not use date in past.';

      case 'oneSubtaskOnly':
        return 'Create another subtask.';

      case 'subtaskExist':
        return 'Subtask already exists.';

      case 'confirmMissmatch':
        return 'Password confirm does not match.'

      case 'acceptPolicy':
        return 'You have to accept the privacy policy.'

      case 'pattern':
        return 'Format is not correct.';
    }
    return 'Value is invalid.';
  }
  // #endregion
  // #endregion
}