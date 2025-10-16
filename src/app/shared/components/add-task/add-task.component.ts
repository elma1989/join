import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';
import { PriorityButtonsComponent } from "../priority-buttons/priority-buttons.component";
import { Category } from '../../enums/category.enum';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityButtonsComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddtaskComponent implements OnInit {

  fireDB: FirebaseDBService = inject(FirebaseDBService);
  Priority = Priority;
  Category = Category;

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
    console.log(this.currentTask.priority);
  }

  

}
