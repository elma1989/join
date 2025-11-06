import { ChangeDetectorRef, Component, inject, input, InputSignal, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  currentTask: InputSignal<Task> = input.required<Task>();
  close: OutputEmitterRef<boolean> = output<boolean>();
  contacts: Array<Contact> = [];
  protected errors: Record<string, string[]> = {};

  unsubContacts!: Unsubscribe;
  subFormChange!: Subscription;

  protected formTask: FormGroup = this.fb.group({
    title: ['', [CustomValidator.strictRequired(), CustomValidator.firstUpperCase(), Validators.minLength(3)]],
    description: [''],
    dueDate: this.fb.group({
      deathline: [ this.defaultDate, [CustomValidator.strictRequired(), CustomValidator.dateFormat(), CustomValidator.dateInPast()]]
    })
  });

  // #endregion properties
  
  ngOnInit(): void {
    this.unsubContacts = this.getContactsSnapshot();
    this.val.registerForm('task', this.formTask);
    this.subFormChange = this.formTask.valueChanges.subscribe(() => this.validate());
  }

  ngOnDestroy(): void {
    this.unsubContacts();
    this.val.removeForm('task');
    this.subFormChange.unsubscribe();
  }

  // #region methods

  /** Validates a form. */
  private validate(): void {
    this.errors = this.val.validateForm('task');
  }

  get dueDateGroup(): FormGroup | null {
    const dategroup = this.formTask.get('dueDate');
    return dategroup ? dategroup as FormGroup : null;
  }

  get defaultDate(): string {
    const date = new Date(Date.now());
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth()+1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /** Submits a form. */
  protected submitForm(): void {
    this.validate();
  }

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
        this.contacts.push(this.fireDB.mapResponseToContact({ ...docRef.data(), id: docRef.id}));
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
  }

  /**
   * Updates existing task in DB
   */
  protected async updateTask(): Promise<void> {
    await this.fireDB.taskUpdateInDB('tasks', this.currentTask());
    this.closeModal();
    // this.tms.add('Task was updated', 3000, 'success');
  }

  /**
   * Reset all inputs to default.
   */
  clear() {
    this.currentTask().title = '';
    this.currentTask().description = '';
    this.currentTask().category = Category.TASK;
    this.currentTask().priority = Priority.MEDIUM;
    this.currentTask().dueDate = Timestamp.fromMillis(
	    Timestamp.now().toMillis() + (24 * 60 * 60 * 1000)
	);
    this.currentTask().subtasks = []
    this.currentTask().hasSubtasks = false;
    this.updateContacts([]);
    this.contacts.forEach(contact => {
      contact.isChecked = false;
    });
  }

  /**
   * Sets the due date of task. 
   * 
   * @param date selected date from date-picker
   */
  setDate(date: Date) {
    this.currentTask().dueDate = Timestamp.fromDate(date)
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
    })
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
      if(subtask.taskId == ''){
        subtask.taskId = this.currentTask().id;
      }
      this.currentTask().subtasks.push(subtask);
    });
    this.currentTask().hasSubtasks = this.currentTask().subtasks.length >= 1;
  }

  /**
   * if this component is part of a modal
   * this method emits a close output which can handle by parent.
   */
  closeModal() {
    this.close.emit(true);
  }
  // #endregion methods
}