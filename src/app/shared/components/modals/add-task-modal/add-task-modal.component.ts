import { AfterViewInit, Component, input, InputSignal } from '@angular/core';
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
  ]
})
/**
 * Component for adding a new task in a modal dialog.
 */
export class AddTaskModalComponent implements AfterViewInit {
  /**
   * The current task being edited or added.
   */
  currentTask: InputSignal<Task> = input<Task>(new Task());

  /**
   * Optional callback that gets called when the modal is fully dissolved/closed.
   */
  dissolve?: () => void;

  /**
   * Flag indicating whether the modal is currently open.
   */
  isOpen = false;

  /**
   * Internal flag to track dragging state during mouse events.
   */
  private isDragging = false;

  /**
   * Lifecycle hook called after the component's view has been initialized.
   * Opens the modal with a small delay for animations.
   */
  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10);
  }

  /**
   * Closes the modal and triggers the optional dissolve callback after a delay.
   */
  closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }

  /**
   * Handles mouse down events on the overlay.
   * If the user clicks on the overlay without dragging, the modal closes.
   *
   * @param event - The mouse event triggered on the overlay.
   */
  overlayMouseDown(event: MouseEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    let isDragging = false;

    const onMouseMove = () => isDragging = true;

    const onMouseUp = () => {
      if (!isDragging) {
        this.closeModal();
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}
