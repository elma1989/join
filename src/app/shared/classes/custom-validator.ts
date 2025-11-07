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
                if (!words.every(word => regex.test(word))) return { firstUpperCase: true };
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
    // #endregion

    /**
     * Checks balidation error, if user has create one subtask only.
     * @param getSubtasks - List of Subtakse of a task.
     * @returns ValidationError or null.
     */
    static oneSubtaskOnly( getSubtasks: () => SubTask[]): ValidatorFn {
        return (): ValidationErrors | null => {
            const subtasks: SubTask[] = getSubtasks();
            return subtasks.length == 1 ? { oneSubtaskOnly: true } : null;
        }
    }

    /**
     * Checks if subtask allready exists.
     * @param getSubtasks Array of Subtasks from a task.
     * @returns validationError or null.
     */
    static subtaskExist ( getSubtasks: () => SubTask[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const subtasks: SubTask[] = getSubtasks();
            const value = control.value;
            for (let i = 0; i < subtasks.length; i++) {
                if (subtasks[i].name == value) return { subtaskExist: true }
            }
            return null;
        }
    }
}