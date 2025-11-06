import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

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
    if (control.errors) {
      errors[path] = [];
      for (const errorKey in control.errors) {
        errors[path].push(this.getErrorMessage(errorKey, control.errors[errorKey]))
      }
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

      case 'firstUpperCase':
        return 'Use upper case at frist.'

      case 'minlength':
        return `Minimal ${errorValue.requiredLength} sign required.`;

      case 'email':
        return 'E-Mail format is not correct.';

      case 'tel':
        return 'Use format: 0<prefix phone number> <phone number>';

      case 'dateFormat':
        return 'Use format: MM/DD/YYYY.'

      case 'dateInPast':
        return 'Do not use date in past.'

      case 'pattern':
        return 'Format is not correct.'
    }
    return 'Value is invalid.';
  }
  // #endregion
}