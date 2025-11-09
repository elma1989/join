import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { SubTask } from "./subTask";

export class CustomValidator {
    // #region RegEx-Validators
    /** 
     * Validator for required fields.
     * Whitspace only is not allowed.
     */
    static strictRequired(name: string = 'strictRequired'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value || typeof value == 'string' && value.trim().length == 0) return { [name]: true };
            return null;
        }
    }

    static customMinLength(min: number): ValidatorFn {
        return (contol: AbstractControl): ValidationErrors | null => {
            const value = contol.value;
            return (value && value.length < min) ? { customMinLength: {customRequiredLength: min } } : null;
        }
    }

    /**
     * Validates a tel number.
     * Format: 0<prefix> <phone number>
     * @returns - ValidationError or null.
     */
    static tel(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const regex: RegExp = /^0\d+ \d+$/;
            if (typeof value != 'string' || !regex.test(value)) return { tel: true }
            return null;
        }
    }

    /**
     * Validates a name, which begins Uppercase
     * @returns - ValidationError or null.
     */
    static firstUpperCase(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value == 'string') {
                const words: string[] = value.split(/[ -]/);
                const regex: RegExp = /^[A-ZÄÖÜ][a-zäöüß]+$/;
                if (value && !words.every(word => regex.test(word))) return { firstUpperCase: true };
            }
            return null;
        }
    }
    // #endregion

    // #region Date-Validators
    /**
     * Validates a date-fromat.
     * @returns - ValidationError or null
     */
    static dateFormat(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value == 'string') {
                const [month = 0, day = 0, year = 0] = value.split('/').map(x => Number(x)).filter(x => !isNaN(x)).map(x => Math.floor(x));
                if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2000) return { dateFormat: true };
                return null;
            }
            return { dateFormat: true }
        }
    }

    /**
     * Checks if date in past.
     * @returns ValidationError or null.
     */
    static dateInPast(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value == 'string') {
                const [month = 0, day = 0, year = 0] = value.split('/').map(x => Number(x));
                const pastDate = Date.now() - 1000 * 60 * 60 * 24; 
                const inputDate = new Date(year, month-1, day)
                if (inputDate.getTime() < pastDate) return { dateInPast: true };
                return null;
            }
            return { dateInPast: true }
        }
    }

    /** Checks, if Subtask allredy exists. */
    static subtaskExist(getSubtasks:() => SubTask[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const subtasks = getSubtasks();
            const value = control.value;
            const exists: boolean = subtasks.some(st => st.name == value);
            return (exists) ? { subtaskExist: true } : null;
        }
    }
    // #endregion
}