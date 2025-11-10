import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, input, InputSignal, OnDestroy, OnInit, output, OutputEmitterRef, Renderer2, ViewChild } from '@angular/core';
import { SubTask } from '../../classes/subTask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubtaskEditState } from '../../enums/subtask-edit-state';
import { ValidationService } from '../../services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subtask',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent implements OnInit, OnDestroy {
  // #region Attributes

  subtasks: InputSignal<SubTask[]> = input.required<SubTask[]>();
  protected reverseSubtasks = computed(() => [...this.subtasks()].reverse());
  createSubtaskGroup: InputSignal<FormGroup> = input.required<FormGroup>();
  outSubtasks: OutputEmitterRef<SubTask[]> = output<SubTask[]>()
  protected newSubtask = new SubTask();
  protected SubtaskEditState = SubtaskEditState;
  protected errorsCreate: Record<string, string[]> = {};

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  rd2: Renderer2 = inject(Renderer2);
  fb: FormBuilder = inject(FormBuilder);
  val: ValidationService = inject(ValidationService);

  subFormCreateSubtask!: Subscription;

  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;
  @ViewChild('errmsg') errmsg!: ElementRef<HTMLParagraphElement>;
  // #endregion attributes

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.subFormCreateSubtask = this.createSubtaskGroup().valueChanges.subscribe(() => this.validate());
  }

  ngOnDestroy(): void {
    this.subFormCreateSubtask.unsubscribe();
  }
  // #region methods

  private validate(): void {
    this.errorsCreate = this.val.validateForm('task');
  }

  protected onFocus(): void {
    this.newSubtask.editMode = true;
  }

  protected blur(): void {
    this.newSubtask.editMode = false;
  }
  // #region CRUD

  /**
   * Adds a valid subtask to array and emits output.
   */
  addSub() {
    this.newSubtask.editMode = false;
    this.newSubtask.editState = SubtaskEditState.NEW;
    this.newSubtask.name = this.createSubtaskGroup().get('subtaskName')?.value ?? '';
    const allSubtasks = this.subtasks();
    const exxits: boolean = allSubtasks.some(x => this.newSubtask.name == x.name);
    if (this.newSubtask.name.trim().length > 0 && !exxits) allSubtasks.push(this.newSubtask);
    this.createSubtaskGroup().reset();
    this.outSubtasks.emit(allSubtasks);
    this.newSubtask = new SubTask();
    this.newSubtask.editMode = true;
  }

  /**
   * Updates an existing subtask. 
   * 
   * @param index index of subtask array.
   */
  updateSub(index: number): void {
    if (this.validateSubtask(this.subtasks()[index])) {
      const allSubtasks = this.subtasks();
      allSubtasks[index].editMode = false;
      allSubtasks[index].editState = SubtaskEditState.CHANGED;
      this.outSubtasks.emit(allSubtasks);
    }
  }

  /**
   * Deletes a subtask.
   * 
   * @param index - Index of subtask array.
   */
  deleteSub(index: number): void {
    const allSubtasks = this.subtasks();
    allSubtasks[index].editMode = false;
    allSubtasks[index].editState = SubtaskEditState.DELETED;
    this.outSubtasks.emit(allSubtasks);
  }

  // #endregion CRUD

  // #region helper

  /**
   * Enables SubtaskEdit-Mode and sets focus on input-field.
   * @param index - Index of subtaskarray
   */
  protected selectEditInput(index: number) {
    this.endbleEditMode(index);
    this.focusEdit();
  }

  /**
   * Resets input of submitted subtask.
   * 
   */
  protected reset(index: number): void {
    if (index == -1) {
      this.newSubtask.name = '';
    }
    else {
      this.subtasks()[index].name = '';
    }
  }

  protected resetCreate() {
    this.createSubtaskGroup().get('subtaskName')?.reset();
  }

  /**
   * Enables submitted edit mode and deactivate all others.
   * 
   * @param index index of input to enable.
   */
  protected endbleEditMode(index: number) {
    const allSubtasks = this.subtasks();
    allSubtasks.forEach((subtask) => {
      subtask.editMode = false
    })
    this.newSubtask.editMode = false;

    if (index == -1) {
      this.newSubtask.editMode = true;
    }
    else {
      allSubtasks[index].editMode = true;
    }
    this.outSubtasks.emit(allSubtasks);
  }

  /** 
   * Sets focus on edit subtask input. 
   */
  private focusEdit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      const el = this.editsub.nativeElement;
      el.focus();
      el.select();
    })
  }

  /**
   * Sende an error message to UI.
   * @param msg - Message to send.
   */
  private sendErrMsg(msg: string): void {
    this.rd2.setProperty(this.errmsg.nativeElement, 'innerText', msg)
  }

  /**
   * Counts name of same subtask.
   * @param subtask - Instance of Subtask.
   * @returns - Number of same Subtask.
   */
  private countSubtaskName(subtask: SubTask): number {
    let counter: number = 0;
    this.subtasks().forEach(cSubtask => {
      if (cSubtask.name == subtask.name && cSubtask.editState != SubtaskEditState.DELETED) {
        counter++;
      }
    });
    return counter;
  }

  /**
   * Validate the submitted subtask.
   * 
   * @param subtask subtask to validate
   * @returns @boolean if subtask is valid
   */
  private validateSubtask(subtask: SubTask): boolean {
    if (subtask.name.length == 0) {
      this.sendErrMsg('Name is required.');
      return false;
    }

    this.sendErrMsg('');
    return true;
  }
  // #endregion helper

  // #endregion methods
}