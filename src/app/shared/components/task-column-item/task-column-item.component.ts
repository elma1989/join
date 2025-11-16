import { Component, inject, input, InputSignal, Output, EventEmitter, Input } from '@angular/core';
import { Task } from '../../classes/task';
import { ContactIconListComponent } from "../contact-icon-list/contact-icon-list.component";
import { Category } from '../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { Firestore } from '@angular/fire/firestore';
import { SubtaskEditState } from '../../enums/subtask-edit-state';
import { FormsModule } from '@angular/forms';
import { TaskStatusType } from '../../enums/task-status-type';

@Component({
  selector: 'app-task-column-item',
  imports: [ContactIconListComponent, CommonModule, FormsModule],
  templateUrl: './task-column-item.component.html',
  styleUrl: './task-column-item.component.scss'
})
export class TaskColumnItemComponent {

  protected modalService: ModalService = inject(ModalService);
  firestore: Firestore = inject(Firestore);

  // Original input for the task
  task: InputSignal<Task> = input.required<Task>();

  // Input for all task lists (provided by the board)
  taskLists: InputSignal<{ listName: string, status: TaskStatusType }[]> =
    input.required<{ listName: string, status: TaskStatusType }[]>();

  // EventEmitter to notify the board of status changes
  @Output() statusChange = new EventEmitter<TaskStatusType>();

  // EventEmitter to notify board when this dropdown is toggled
  @Output() toggleDropdown = new EventEmitter<string>();

  SubtaskEditState = SubtaskEditState;
  Category = Category;

  // Dropdown open state controlled by the board
  @Input() isDropdownOpen: boolean = false;

  /**
   * Calculates the number of completed subtasks.
   */
  get completedSubtaskCount(): number {
    return this.task().subtasks.filter(sub => sub.editState != SubtaskEditState.DELETED && sub.finished).length;
  }

  /**
   * Calculates the total number of subtasks.
   */
  get totalSubtaskCount(): number {
    return this.task().subtasks.filter(sub => sub.editState != SubtaskEditState.DELETED).length;
  }

  /**
   * Calculates the progress of subtasks as a percentage.
   */
  get subtaskProgressPercentage(): number {
    if (this.totalSubtaskCount === 0) return 0;
    return (this.completedSubtaskCount / this.totalSubtaskCount) * 100;
  }

  /**
   * Determines if the subtask progress bar should be visible.
   */
  get isSubtaskProgressVisible(): boolean {
    return this.totalSubtaskCount >= 2;
  }

  /**
   * Called when the menu button is clicked.
   * Emits the task ID to the board to toggle dropdown.
   */
  toggleMenu(): void {
    this.toggleDropdown.emit(this.task().id);
  }

  /**
   * Returns all task lists except the current task's status.
   */
  get availableStatus() {
    return this.taskLists().filter(list => list.status !== this.task().status);
  }

  /**
   * Handles user click on a dropdown item to change the task status.
   */
  changeStatus(newStatus: TaskStatusType) {
    this.statusChange.emit(newStatus);
    this.isDropdownOpen = false;
  }
}
