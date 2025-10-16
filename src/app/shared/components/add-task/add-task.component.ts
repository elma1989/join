import { Component, inject, OnInit } from '@angular/core';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddtaskComponent implements OnInit {

  fireDB: FirebaseDBService = inject(FirebaseDBService);
  Priority = Priority;

  currentTask: Task = new Task();

  

  ngOnInit() {

  }

  /**
   * Submit the entered data as new Task to DB
   *  
   * @param e event
   */
  async submitForm(e: SubmitEvent) {
    console.log('submit');
  }

  /**
   * Reset all inputs to default.
   */
  clear() {

  }

  protected setPriority(prio: Priority){
    this.currentTask.priority = prio;
  }

}
