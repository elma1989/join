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
        const value = String(control.value || '').replace(/\s/g, ''); 
        const regex: RegExp = /^0\d+$/; 
        
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
    static dateInPast(getCreate: () => Date): ValidatorFn {
        const created = getCreate().setHours(0, 0, 0 ,0);
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value == 'string') {
                const [month = 0, day = 0, year = 0] = value.split('/').map(x => Number(x));
                const pastDate = Date.now() - 1000 * 60 * 60 * 24; 
                const inputDate = new Date(year, month-1, day)
                if (inputDate.getTime() < pastDate && inputDate.getTime() < created) return { dateInPast: true };
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

    /**
     * Checks, if password indludes upper case, lower case, number and special-character.
     * @param name - Name of type (uppperCase, lowerCase, number, special)
     * @returns ValidationError or null
     */
    static includes(name: 'upperCase'| 'lowerCase' | 'number' | 'special'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const regex: RegExp = CustomValidator.getRegex(name);
            const value = control.value;
            const error = { [name]: true};
            if (typeof value != 'string') return error;
            const match = value.match(regex);
            if (!match) return error;
            return match.length < 1 ? error : null;
        }
    }

    /**
     * Gets regular expression for type.
     * @param name - Name of type.
     * @returns regular expression for type.
     */
    static getRegex(name: string): RegExp {
        switch(name) {
            case 'upperCase':
                return /[A-ZÄÖÜ]/;
            case 'lowerCase':
                return /[a-zäöüß]/;
            case 'number':
                return /[0-9]/;
            default: return /[^A-Za-zÄäÖöÜü0-9/s]/;
        }
    }

    /** Checks if user has policy acepted. */
    static acceptPolicy(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value ? null : { acceptPolicy: true };
        }
    }
    // #endregion
}