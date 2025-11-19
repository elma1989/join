import { ChangeDetectorRef, Component, HostListener, inject, input, InputSignal, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';
import { PriorityButtonsComponent } from "../priority-buttons/priority-buttons.component";
import { Category } from '../../enums/category.enum';
import { query, Unsubscribe, where, Query, onSnapshot, Timestamp, Firestore, collection, CollectionReference, addDoc, updateDoc } from '@angular/fire/firestore';
import { Contact } from '../../classes/contact';
import { DatePickerComponent } from "../date-picker/date-picker.component";
import { AssignContactsComponent } from "../assign-contacts/assign-contacts.component";
import { ToastMsgService } from '../../services/toast-msg.service';
import { SubtaskComponent } from '../subtask/subtask.component';
import { SubtaskEditState } from '../../enums/subtask-edit-state';
import { SubTask } from '../../classes/subTask';
import { CategoryDropComponent } from "../category-drop/category-drop.component";
import { ValidationService } from '../../services/validation.service';
import { Subscription } from 'rxjs';
import { CustomValidator } from '../../classes/custom-validator';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PriorityButtonsComponent,
    DatePickerComponent,
    AssignContactsComponent,
    SubtaskComponent,
    CategoryDropComponent,
    ReactiveFormsModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddtaskComponent implements OnInit, OnDestroy {

  // #region properties

  fireDB: FirebaseDBService = inject(FirebaseDBService);
  fs: Firestore = inject(Firestore);
  tms: ToastMsgService = inject(ToastMsgService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  fb: FormBuilder = inject(FormBuilder);
  val: ValidationService = inject(ValidationService);

  Priority = Priority;
  Category = Category;
  addMode: boolean = false;

  currentTask: InputSignal<Task> = input.required<Task>();
  close: OutputEmitterRef<boolean> = output<boolean>();
  contacts: Array<Contact> = [];
  protected errors: Record<string, string[]> = {};
  protected tempDate: Timestamp | null = null;

  unsubContacts!: Unsubscribe;
  subFormChange!: Subscription;

  protected formTask!: FormGroup;

  // #endregion properties

  ngOnInit(): void {
    this.addMode = this.currentTask().id == '';
    this.unsubContacts = this.getContactsSnapshot();
    this.formInit();
    this.val.registerForm('task', this.formTask);
    this.subFormChange = this.formTask.valueChanges.subscribe(() => this.validate());
  }

  ngOnDestroy(): void {
    this.unsubContacts();
    this.val.removeForm('task');
    this.subFormChange.unsubscribe();
  }

  // #region methods
  // #region Form methods
  /** Sets default Values in form. */
  private formInit(): void {
    const title = this.currentTask().id == '' ? '' : this.currentTask().title;
    const desc = this.currentTask().id == '' ? '' : this.currentTask().description;
    const dueDate = this.currentTask().id == '' ? this.defaultDate : this.convertTimestamp(this.currentTask().dueDate);
    this.formTask = this.fb.group({
      title: [title, [CustomValidator.strictRequired(), Validators.minLength(3)]],
      description: [desc],
      dueDate: this.fb.group({
        deathline: [dueDate, [CustomValidator.strictRequired(), CustomValidator.dateFormat(), CustomValidator.dateInPast(() => this.currentTask().created.toDate())]]
      }),
      createSubtask: this.fb.group({
        subtaskName: ['', [CustomValidator.customMinLength(3), CustomValidator.subtaskExist(() => this.currentTask().subtasks)]]
      })
    });
  }
  
  /** Validates a form. */
  private validate(): void {
    this.errors = this.val.validateForm('task');
  }

  get defaultDate(): string {
    const date = new Date(Date.now());
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  get formTimestamp(): Timestamp {
    const date: string = this.formTask.get('dueDate.deathline')?.value ?? '';
    if (date) {
      const [month, day, year]: number[] = date.split('/').map(x => Number(x));
      return Timestamp.fromDate(new Date(year, month - 1, day))
    }
    return Timestamp.now();
  }

  getFormgroup(name: string): FormGroup {
    const dategroup = this.formTask.get(name);
    return dategroup ? dategroup as FormGroup : new FormGroup(name);
  }

  private convertTimestamp(timestamp: Timestamp): string {
    const date: Date = timestamp.toDate();
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: number = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
 * Submits the task form after triggering validation.
 * Marks the form as touched, validates it, and then
 * proceeds with the appropriate taskr depending on validity.
 * @protected
 * @returns {void}
 */
  protected submitForm(): void {
    if (this.currentTask().id == '') this.val.polluteForm('task');
    const dirty: boolean = Object.keys(this.formTask.controls).some(control => {
      const child = this.formTask.get(control);
      if (child) return child.dirty;
      return false;
    });

    this.validate();
    if (this.formTask.valid && dirty) this.taskValidForm();
    else this.taskInvalidForm();
  }

  /**
   * tasks the logic when the task form is valid.
   * Retrieves the current task, updates its properties based on
   * form values, and either adds or updates the task depending
   * on the current mode.
   * @private
   * @returns {void}
   */
  private taskValidForm(): void {
    const task = this.currentTask();
    task.title = this.formTask.get('title')?.value ?? '';
    task.description = this.formTask.get('description')?.value ?? '';
    task.dueDate = this.formTimestamp;

    if (this.addMode) this.addTask();
    else this.updateTask();
  }

  /**
   * Reset all inputs to default.
   */
  clear() {
    this.formTask.reset();
    if (this.addMode) {
      this.currentTask().priority = Priority.MEDIUM;
      this.currentTask().contacts = [];
    }
  }
  // #endregion

  // #region CRUD
  /**
   * Opens a two way data stream between code and firebase collection 'contacts'.
   * 
   * @returns an @type Unsubscribe.
   */
  private getContactsSnapshot(): Unsubscribe {
    const q: Query = query(this.fireDB.getCollectionRef('contacts'), where('id', '!=', ''));

    return onSnapshot(q, (list) => {
      this.contacts = [];
      list.forEach((docRef) => {
        this.contacts.push(this.fireDB.mapResponseToContact({ ...docRef.data(), id: docRef.id }));
      });
    });
  }

  /** 
   * Adds a task into Database. 
   */
  protected async addTask(): Promise<void> {
    await this.fireDB.taskAddToDB('tasks', this.currentTask());
    this.cdr.detectChanges();
    this.clear();
    this.tms.add('Task was created', 3000, 'success');
  }

  /**
   * Updates existing task in DB
   */
  protected async updateTask(): Promise<void> {
    await this.fireDB.taskUpdateInDB('tasks', this.currentTask());
      this.closeModal();
      this.tms.add('Task was updated', 3000, 'success');
  }

  /**
 * tasks form submission when the form is invalid.
 * Shows an error message depending on whether a task
 * was being created or updated.
 * @private
 * @returns {void}
 */
  private taskInvalidForm(): void {
    if (this.addMode) {
      this.tms.add('Task wasn’t created', 3000, 'error');
    } else {
      this.tms.add('Task was not updated', 3000, 'error');
    }
  }

  /**
   * Sets the due date of task. 
   * 
   * @param date selected date from date-picker
   */
  setDate(date: Timestamp) {
    this.tempDate = date;
  }

  /**
   * Sets the chosen contacts to task contacts.
   * 
   * @param chosenContacts Array<Contact> with selected contacts
   */
  updateContacts(chosenContacts: Array<Contact>) {
    this.currentTask().contacts = chosenContacts;
    this.currentTask().assignedTo = [];
    chosenContacts.forEach((contact) => {
      this.currentTask().assignedTo.push(contact.id);
    });
  }

  /**
   * 
   * @param category 
   */
  updateCategory(category: Category) {
    this.currentTask().category = category;
  }

  /**
   * Sets the submitted subtasks to task subTasks.
   * @param subtasks 
   */
  updateSubtasks(subtasks: Array<SubTask>) {
    this.currentTask().subtasks = [];
    subtasks.forEach((subtask) => {
      if (subtask.taskId == '') {
        subtask.taskId = this.currentTask().id;
      }
      this.currentTask().subtasks.push(subtask);
    });
    this.currentTask().hasSubtasks = this.currentTask().subtasks.length >= 1;
  }
  // #endregion

  /**
   * if this component is part of a modal
   * this method emits a close output which can task by parent.
   */
  closeModal() {
    this.close.emit(true);
  }
  // #endregion methods
}