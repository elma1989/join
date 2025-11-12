import { AfterViewInit, Component, ElementRef, HostListener, input, InputSignal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddtaskComponent } from "../../add-task/add-task.component";
import { Task } from '../../../classes/task';

@Component({
  selector: 'app-add-task-modal',
  imports: [AddtaskComponent],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss',
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      state('closed', style({
        transform: 'translateX(100vw)',
        opacity: 0,
      })),
      transition('closed => open', [
        animate('500ms ease-out')
      ]),
      transition('open => closed', [
        animate('400ms ease-in')
      ])
    ])
  ],
})
/**
 * Component responsible for displaying and managing a modal dialog
 * used to add or edit a task.
 */
export class AddTaskModalComponent implements AfterViewInit {
  /**
   * The current task being edited or created.
   */
  currentTask: InputSignal<Task> = input<Task>(new Task());

  /**
   * Optional callback function that is executed
   * after the modal is fully closed and dissolved.
   */
  dissolve?: () => void;

  /**
   * Flag that indicates whether the modal is currently open.
   */
  isOpen = false;

  constructor(private el: ElementRef) {}

  /**
   * Internal flag used to track whether the user is currently dragging the mouse.
   * Helps differentiate between click and drag actions.
   */
  protected isDragging = false;

  /**
   * Lifecycle hook called once the component's view has been initialized.
   * Opens the modal slightly delayed to allow the animation to trigger properly.
   */
  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10);
  }

  /**
   * Closes the modal window and triggers the optional dissolve callback
   * after a short delay to match the closing animation duration.
   */
  closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }

  /**
   * Handles the mousedown event on the overlay background.
   * If the click occurs directly on the overlay (not on the modal content),
   * the dragging state is reset to prepare for a potential outside click.
   *
   * @param event - The MouseEvent triggered when the user clicks on the overlay.
   */
  overlayMouseDown(event: MouseEvent) {
    if (event.target !== event.currentTarget) return;
    this.closeModal();
  }

  /**
   * Handles global mouse move events.
   * Sets the dragging flag to true when the mouse is moved,
   * indicating that the user is performing a drag operation.
   *
   * @param event - The MouseEvent triggered when the mouse moves.
   */
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.isDragging = true;
  }

  /**
   * Handles the global mouseup event fired anywhere in the window.
   * Determines whether the mouseup occurred inside or outside the modal.
   * If the mouseup happens outside the modal and no dragging was detected,
   * the modal will be closed.
   *
   * @param event - The MouseEvent triggered when the user releases the mouse button.
   */
  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {

    this.isDragging = false;
  }
}