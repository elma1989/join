import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Task } from '../../shared/classes/task';
import { onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { Contact } from '../../shared/classes/contact';
import { SubTask } from '../../shared/classes/subTask';
import { ContactObject } from '../../shared/interfaces/contact-object';
import { SubtaskObject } from '../../shared/interfaces/subtask-object';
import { TaskObject } from '../../shared/interfaces/task-object';
import { ModalService } from '../../shared/services/modal.service';
import { TaskColumnItemComponent } from '../../shared/components/task-column-item/task-column-item.component';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { ToastMsgService } from '../../shared/services/toast-msg.service';
import { SearchTaskComponent } from '../../shared/components/search-task/search-task.component';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';
import { SectionType } from '../../shared/enums/section-type';

@Component({
  selector: 'section[board]',
  standalone: true,
  imports: [
    SearchTaskComponent,
    CommonModule,
    TaskColumnItemComponent,
    DragDropModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnDestroy, OnInit {
  // #region Attributes

  /** Emits the currently selected section. */
  @Output() selectedSection = new EventEmitter<SectionType>();

  /** Service for modals. */
  protected modalService: ModalService = inject(ModalService);

  /** Service for Firebase DB operations. */
  private fireDB: FirebaseDBService = inject(FirebaseDBService);

  /** Service to show toast messages. */
  private tms: ToastMsgService = inject(ToastMsgService);

  /** ChangeDetectorRef to manually trigger change detection. */
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** Service to detect display size. */
  protected dss: DisplaySizeService = inject(DisplaySizeService);

  /** Enum for display types. */
  DisplayType = DisplayType;

  // Primary Data
  tasks: Task[] = [];
  private shownTasks: Task[] = [];

  /** Defines the different task lists with their status. */
  protected taskLists: {
    listName: string,
    status: TaskStatusType
  }[] = [
      { listName: 'To do', status: TaskStatusType.TODO },
      { listName: 'In progress', status: TaskStatusType.PROGRESS },
      { listName: 'Await feedback', status: TaskStatusType.REVIEW },
      { listName: 'Done', status: TaskStatusType.DONE }
    ]

  /** Holds tasks grouped by their list for rendering. */
  protected taskItems: Task[][] = [[], [], [], []];

  // Database references
  private contacts: Contact[] = [];
  private subtasks: SubTask[] = [];
  private unsubTasks!: Unsubscribe;
  private unsubContacts!: Unsubscribe;
  private unsubSubtasks!: Unsubscribe;

  // #endregion

  ngOnInit(): void {
    this.unsubContacts = this.subscribeContacts();
    this.unsubSubtasks = this.subscribeSubtasks();
    this.unsubTasks = this.subscribeTasks();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.unsubContacts();
    this.unsubSubtasks();
    this.unsubTasks();
  }

  // #region Methods
  // #region Database

  /**
   * Subscribes to the contacts collection in Firestore.
   * @returns An unsubscribe function for contacts.
   */
  private subscribeContacts(): Unsubscribe {
    return onSnapshot(this.fireDB.getCollectionRef('contacts'), contactsSnap => {
      this.contacts = [];
      contactsSnap.docs.map(doc => { this.contacts.push(new Contact(doc.data() as ContactObject)) });
      this.sortContacts();
    });
  }

  /**
   * Subscribes to the subtasks collection in Firestore.
   * @returns An unsubscribe function for subtasks.
   */
  private subscribeSubtasks(): Unsubscribe {
    return onSnapshot(this.fireDB.getCollectionRef('subtasks'), subtasksSnap => {
      this.subtasks = [];
      subtasksSnap.docs.map(doc => { this.subtasks.push(new SubTask(doc.data() as SubtaskObject)) })
    });
  }

  /**
   * Subscribes to the tasks collection in Firestore.
   * @returns An unsubscribe function for tasks.
   */
  private subscribeTasks(): Unsubscribe {
    return onSnapshot(this.fireDB.getCollectionRef('tasks'), taskSnap => {
      this.tasks = [];
      this.shownTasks = [];
      taskSnap.docs.map(doc => { this.tasks.push(new Task(doc.data() as TaskObject)) });
      for (let i = 0; i < this.tasks.length; i++) {
        this.addContactsToTask(i);
        this.addSubtasktoTask(i);
      }
      this.shownTasks = this.tasks;
      this.splitTasks();
      for (let i = 0; i < this.taskLists.length; i++) {
        this.sortTasks(i);
      }
    });
  }

  /**
   * Updates a task in Firestore.
   * @param task - The task to update.
   */
  private async updateTask(task: Task) {
    await this.fireDB.taskUpdateInDB('tasks', task);
    this.tms.add('Task was updated', 3000, 'success');
  }

  // #endregion
  // #region Task Management

  /**
   * Filters all tasks based on user input.
   * @param userSearch - The search string entered by the user.
   */
  filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0
      ? this.tasks
      : this.tasks.filter(task => task.title.toLowerCase().includes(userSearch.toLowerCase()));
    this.splitTasks();
  }

  /**
   * Divides all currently shown tasks into their respective lists.
   */
  private splitTasks() {
    this.taskItems = [[], [], [], []];
    for (let i = 0; i < this.shownTasks.length; i++) {
      switch (this.shownTasks[i].status) {
        case TaskStatusType.TODO:
          this.taskItems[0].push(this.shownTasks[i]);
          break;
        case TaskStatusType.PROGRESS:
          this.taskItems[1].push(this.shownTasks[i]);
          break;
        case TaskStatusType.REVIEW:
          this.taskItems[2].push(this.shownTasks[i]);
          break;
        case TaskStatusType.DONE:
          this.taskItems[3].push(this.shownTasks[i]);
      }
    }
  }

  /**
   * Returns all currently shown tasks.
   */
  getTasks() {
    return this.shownTasks;
  }

  /**
   * Gets tasks filtered by status.
   * @param status - The status to filter by.
   * @returns Array of tasks with the given status.
   */
  getTaskForList(status: TaskStatusType): Task[] {
    return this.shownTasks.filter(task => task.status == status);
  }

  /**
   * Adds all contacts to a specific task based on assigned IDs.
   * @param index - The index of the task in the tasks array.
   */
  private addContactsToTask(index: number) {
    this.tasks[index].contacts = [];
    for (let i = 0; i < this.tasks[index].assignedTo.length; i++) {
      for (let j = 0; j < this.contacts.length; j++) {
        if (this.tasks[index].assignedTo[i] == this.contacts[j].id) {
          this.tasks[index].contacts.push(this.contacts[j]);
        }
      }
    }
  }

  /**
   * Adds all subtasks to a specific task.
   * @param index - The index of the task in the tasks array.
   */
  private addSubtasktoTask(index: number) {
    for (let i = 0; i < this.subtasks.length; i++) {
      if (this.tasks[index].hasSubtasks && this.subtasks[i].taskId == this.tasks[index].id) {
        if (!this.tasks[index].subtasks.includes(this.subtasks[i])) {
          this.tasks[index].subtasks.push(this.subtasks[i]);
        }
      }
    }
  }

  /**
   * Sorts the contacts array by firstname, then lastname.
   */
  private sortContacts(): void {
    this.contacts.sort((a, b) => {
      const firstCompare: number = a.firstname.localeCompare(b.firstname, 'de');
      if (firstCompare == 0) {
        return a.lastname.localeCompare(b.lastname, 'de');
      }
      return firstCompare;
    });
  }

  /**
   * Sorts the tasks in a specific list by due date ascending.
   * @param index - The index of the task list.
   */
  private sortTasks(index: number): void {
    this.taskItems[index].sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
  }

  /**
   * Handles drag-and-drop of tasks between lists.
   * @param e - The drag-drop event.
   */
  protected drop(e: CdkDragDrop<Task[]>): void {
    const previousList = e.previousContainer.data || [];
    const currentList = e.container.data || [];

    if (e.previousContainer != e.container) {
      transferArrayItem(previousList, currentList, e.previousIndex, e.currentIndex);
      currentList.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
      if (this.taskItems[0].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.TODO;
      else if (this.taskItems[1].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.PROGRESS;
      else if (this.taskItems[2].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.REVIEW;
      else e.item.data.status = TaskStatusType.DONE;
      this.updateTask(e.item.data);
    }
  }

  /**
   * Handles status change emitted from a task column item.
   * @param task - The task to update.
   * @param newStatus - The new status to assign.
   */
  onStatusChange(task: Task, newStatus: TaskStatusType) {
    task.status = newStatus;
    this.updateTask(task);
    this.splitTasks();
    this.openedTaskDropdownId = null;
  }

  /** Currently opened task dropdown ID */
  protected openedTaskDropdownId: string | null = null;

  /**
   * Toggles a task dropdown menu.
   * @param taskId - ID of the task to toggle
   */
  toggleDropdown(taskId: string) {
    if (this.openedTaskDropdownId === taskId) {
      // Clicked the same task → close it
      this.openedTaskDropdownId = null;
    } else {
      // Close previous, open new
      this.openedTaskDropdownId = taskId;
    }


    // #endregion
  }
}