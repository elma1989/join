import { ChangeDetectorRef, Component, EventEmitter, inject, input, InputSignal, OnDestroy, OnInit, output, Output, OutputEmitterRef, } from '@angular/core';
import { onSnapshot, Timestamp, Unsubscribe } from '@angular/fire/firestore';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { Task } from '../../shared/classes/task';
import { TaskObject } from '../../shared/interfaces/task-object';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { SectionType } from '../../shared/enums/section-type';
import { User } from '../../shared/classes/user';

@Component({
  selector: 'section[summary]',
  imports: [CommonModule],
  templateUrl: './summmary.component.html',
  styleUrls: ['./summmary.component.scss'],
})
export class SummmaryComponent implements OnInit, OnDestroy {
  //region Attributes
  /**
   * Change detector reference used to manually trigger UI updates
   * when Firestore data changes asynchronously.
   */
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  user: InputSignal<User | null> = input<User | null>(null);

  /**
   * Event emitter used to notify the parent component when
   * the user navigates to a different section (e.g., the board view).
   */
  @Output() selectedSection = new EventEmitter<SectionType>();

  /**
   * Exposes the Priority enum to the template for easy access.
   */
  Priority = Priority;

  /**
   * Holds the unsubscribe function for the Firestore snapshot listener.
   * Ensures that the listener is properly detached on component destruction.
   * @private
   */
  private unsubTasks!: Unsubscribe;

  /** Number of tasks currently in the "To Do" status. */
  todoCount: number = 0;

  /** Number of tasks currently in progress. */
  progressCount: number = 0;

  /** Number of tasks currently under review. */
  reviewCount: number = 0;

  /** Number of tasks that are completed. */
  doneCount: number = 0;

  /** Total number of tasks retrieved from Firestore. */
  totalTasks: number = 0;

  /**
   * List of today’s tasks filtered and sorted by priority.
   * Used to display the next upcoming or urgent tasks.
   */
  sortedTasks: Task[] = [];

  // #endregion

  /**
   * Creates an instance of `SummmaryComponent`.
   * @param fireDB The service responsible for communicating with Firestore.
   */
  constructor(private fireDB: FirebaseDBService) {}

  get greating():string {
    const user = this.user();
    return user ? user.getFullName() : 'User';
  }

  // #region Lifecycle Hooks

  /**
   * Angular lifecycle hook called once after component initialization.
   * Subscribes to Firestore task updates and triggers change detection.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.subscribeTasksStatusCount();
    this.cdr.detectChanges();
  }

  /**
   * Angular lifecycle hook called before the component is destroyed.
   * Cleans up active Firestore listeners to prevent memory leaks.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.unsubTasks) this.unsubTasks();
  }

  // #endregion

  // #region Navigation

  /**
   * Emits an event to navigate to the board section.
   *
   * @returns {void}
   */
  goToBoard(): void {
    this.selectedSection.emit(SectionType.BOARD);
  }

  // #endregion

  // #region Firestore Subscription

  /**
   * Subscribes to Firestore’s "tasks" collection.
   *
   * Whenever a change occurs in Firestore, this method:
   * - Retrieves all tasks from the snapshot.
   * - Calculates today’s most relevant tasks (`getNextTasks()`).
   * - Updates the task status counts (`updateStatusCounts()`).
   * - Triggers manual UI refresh via ChangeDetectorRef.
   *
   * @private
   * @returns {void}
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

  // #endregion

  // #region Update Task Counts

  /**
   * Calculates the total number of tasks in each status category.
   * Resets counters before recounting to avoid accumulation.
   *
   * @private
   * @param {Task[]} tasks - The list of tasks retrieved from Firestore.
   * @returns {void}
   */
  private updateStatusCounts(tasks: Task[]): void {
    this.todoCount = 0;
    this.progressCount = 0;
    this.reviewCount = 0;
    this.doneCount = 0;

    tasks.forEach(task => {
    if (task.status === TaskStatusType.TODO) {
      this.todoCount++;
    } else if (task.status === TaskStatusType.PROGRESS) {
      this.progressCount++;
    } else if (task.status === TaskStatusType.REVIEW) {
      this.reviewCount++;
    } else if (task.status === TaskStatusType.DONE) {
      this.doneCount++;
    }
  });

    this.totalTasks = tasks.length;
  }

  // #endregion

  // #region Get Next Tasks (Daily)

  /**
   * Returns a list of today’s active tasks sorted by priority.
   *
   * Only tasks with a due date matching today’s date are included.
   * Tasks marked as "DONE" are ignored.
   *
   * @private
   * @param {Task[]} tasks - The list of all tasks from Firestore.
   * @returns {Task[]} The filtered and priority-sorted list of today's tasks.
   */
  private getNextTasks(tasks: Task[]): Task[] {
    if (tasks.length === 0) return [];

    const todayString = new Date().toDateString();

    const todaysTasks = tasks.filter(
      (task) =>
        task.dueDate.toDate().toDateString() === todayString &&
        task.status !== TaskStatusType.DONE
    );

    if (todaysTasks.length === 0) return [];

    return this.filterPriority(todaysTasks);
  }

  // #endregion

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
  
  // #endregion
}


