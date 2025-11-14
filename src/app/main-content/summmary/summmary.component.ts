import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { onSnapshot, Timestamp, Unsubscribe } from '@angular/fire/firestore';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { Task } from '../../shared/classes/task';
import { TaskObject } from '../../shared/interfaces/task-object';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { SectionType } from '../../shared/enums/section-type';

@Component({
  selector: 'section[summary]',
  imports: [CommonModule],
  templateUrl: './summmary.component.html',
  styleUrls: ['./summmary.component.scss'],
})
/**
 * Component responsible for displaying a summary of tasks, including counts by status 
 * and a list of next tasks sorted by priority.
 */
export class SummmaryComponent implements OnInit, OnDestroy {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Event emitter to notify parent component when user navigates to a different section.
   */
  @Output() selectedSection = new EventEmitter<SectionType>();

  /** Exposes the Priority enum to the template for easy access */
  Priority = Priority;

  /** Stores the unsubscribe function for Firestore snapshot listener */
  private unsubTasks!: Unsubscribe;

  /** Task counts by status */
  todoCount: number = 0;
  progressCount: number = 0;
  reviewCount: number = 0;
  doneCount: number = 0;
  totalTasks: number = 0;

  /** List of tasks sorted by priority for display */
  sortedTasks: Task[] = [];

  constructor(private fireDB: FirebaseDBService) {}

  /**
   * Angular lifecycle hook called after component initialization.
   * Subscribes to Firestore tasks collection and triggers initial UI update.
   */
  ngOnInit(): void {
    this.subscribeTasksStatusCount();
    this.cdr.detectChanges();
  }

  /**
   * Angular lifecycle hook called before component destruction.
   * Unsubscribes from Firestore snapshot listener to avoid memory leaks.
   */
  ngOnDestroy(): void {
    if (this.unsubTasks) this.unsubTasks();
  }

  /**
   * Emits an event to navigate to the board section.
   */
  goToBoard(): void {
    this.selectedSection.emit(SectionType.BOARD);
  }

  /**
   * Subscribes to the Firestore "tasks" collection and listens for changes.
   * Updates sorted tasks and task counts on every snapshot.
   * @private
   */
  private subscribeTasksStatusCount(): void {
    this.unsubTasks = onSnapshot(
      this.fireDB.getCollectionRef('tasks'),
      (snapshot) => {
        const tasks: Task[] = snapshot.docs.map(
          (doc) => new Task(doc.data() as TaskObject)
        );

        this.sortedTasks = this.getNextTasks(tasks);
        this.updateStatusCounts(tasks);
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Updates the number of tasks for each status (TODO, PROGRESS, REVIEW, DONE).
   * Also updates the total number of tasks.
   * @param tasks - Array of Task objects retrieved from Firestore.
   * @private
   */
  private updateStatusCounts(tasks: Task[]): void {
    this.todoCount = 0;
    this.progressCount = 0;
    this.reviewCount = 0;
    this.doneCount = 0;

    tasks.forEach(task => {
      switch (task.status) {
        case TaskStatusType.TODO: this.todoCount++; break;
        case TaskStatusType.PROGRESS: this.progressCount++; break;
        case TaskStatusType.REVIEW: this.reviewCount++; break;
        case TaskStatusType.DONE: this.doneCount++; break;
      }
    });

    this.totalTasks = tasks.length;
  }

  /**
   * Returns the lowest due date among all tasks that are not completed.
   * @param tasks - Array of Task objects.
   * @returns The Timestamp representing the earliest due date.
   * @private
   */
  private getLowestDueDate(tasks: Task[]): Timestamp {
    let lowestDate = Timestamp.fromMillis(
      Timestamp.now().toMillis() + 24 * 60 * 60 * 1000 * 365
    );

    tasks.forEach((task) => {
      if (task.dueDate.seconds < lowestDate.seconds && task.status !== TaskStatusType.DONE) {
        lowestDate = task.dueDate;
      }
    });

    return lowestDate;
  }

  /**
 * Determines the next tasks to display:
 * - First returns all non-DONE tasks due today.
 * - If none exist, returns tasks with the nearest future due date.
 * Past tasks and tasks marked as DONE are ignored.
 *
 * @param tasks - List of all tasks.
 * @returns Tasks due today or at the next upcoming date, sorted by priority.
 * @private
 */
  private getNextTasks(tasks: Task[]): Task[] {
  if (tasks.length === 0) return [];
  const today = new Date(), todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayStr = todayStart.toDateString();

  const todays = tasks.filter(t =>
    t.dueDate.toDate().toDateString() === todayStr &&
    t.status !== TaskStatusType.DONE
  );
  if (todays.length) return this.filterPriority(todays);

  const future = tasks.filter(t => t.dueDate.toDate() >= todayStart);
  if (!future.length) return [];

  const nextDate = this.getLowestDueDate(future);
  return this.filterPriority(this.filterTasksLowestDate(future, nextDate));
}

  /**
   * Filters tasks to only include those that have the exact given due date.
   * @param tasks - Array of Task objects.
   * @param lowestDate - Timestamp to filter tasks by.
   * @returns Array of Task objects matching the given due date.
   * @private
   */
  private filterTasksLowestDate(tasks: Task[], lowestDate: Timestamp): Task[] {
    return tasks.filter(
      task => task.dueDate.toDate().toDateString() === lowestDate.toDate().toDateString()
    );
  }

  // #region Filter Priority

  /**
   * Filters and sorts the given list of tasks based on their priority level.
   *
   * The priority order is:
   * 1. URGENT
   * 2. MEDIUM
   * 3. LOW
   *
   * If multiple tasks share the same priority, they are all included.
   *
   * @private
   * @param {Task[]} filteredTasks - The list of today’s tasks to sort by priority.
   * @returns {Task[]} The sorted list of high-priority tasks.
   */
  private filterPriority(filteredTasks: Task[]): Task[] {
    const sortedTasks: Task[] = [];

    if (filteredTasks.length === 1) {
      sortedTasks.push(filteredTasks[0]);
    } else {
      if (filteredTasks.some((task) => task.priority === Priority.URGENT)) {
        sortedTasks.push(
          ...filteredTasks.filter((task) => task.priority === Priority.URGENT)
        );
      } else if (filteredTasks.some((task) => task.priority === Priority.MEDIUM)) {
        sortedTasks.push(
          ...filteredTasks.filter((task) => task.priority === Priority.MEDIUM)
        );
      } else if (filteredTasks.some((task) => task.priority === Priority.LOW)) {
        sortedTasks.push(
          ...filteredTasks.filter((task) => task.priority === Priority.LOW)
        );
      }
    }

    return sortedTasks;
  }

  // #endregion
}
