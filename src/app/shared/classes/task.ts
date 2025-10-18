import { Category } from "../enums/category.enum";
import { Priority } from "../enums/priority.enum";
import { TaskStatusType } from "../enums/task-status-type";
import { DBObject } from "../interfaces/db-object";
import { Contact } from "./contact";
import { SubTask } from "./subTask";

/**
 * Contains a single task object.
 */
export class Task implements DBObject{

	// #region properties
	
	/** id of task in database, empty, if not exist in database */
	id: string = '';

	/** title of task, small and clear definition of task */
	title: string = '';

	/** description of task, extendet definition of task / user story */
	description: string = '';

	/** definition of date until task hast to be done, (not in past) */
	dueDate: string = '';

	/** priority of task, defines how important is task */
	priority: Priority = Priority.MEDIUM;

	/** category of task, defines which category this task belongs */
	category: Category = Category.USERSTORY;

	/** an array of contact ids which are assigned to task */
	assignedTo: Contact[] = [];

	/** an indicator wether this task has subtasks */
	subtasks: SubTask[] = [];

	/** Type in wich litst Task is. */
	status: TaskStatusType = TaskStatusType.TODO;

	// #endregion properties

	/**
     * @param data is optional and from @type object {
     *      id: string          		=> id of task in database, empty, if not exist in database
     *      title: string   			=> title of task, small and clear definition of task
     *      decription: string    		=> description of task, extendet definition of task / user story
     *      dueDate: string       		=> definition of date until task hast to be done, (not in past)
     *      priority: Priority       	=> priority of task, defines how important is task
     *      category: Category         	=> category of task, defines which category this task belongs
     *      assignedTo: Array<string>   => an array of contact ids which are assigned to task 
	 * 		subtasks: boolean			=> an indicator wether this task has subtasks
	 * 		status: TaskStatusType		=> in which List is task
     * }
     */
	constructor(data?: { id: string, title: string, description: string, dueDate: string, priority: Priority, category: Category, assignedTo: Contact[], subtasks: SubTask[], status: TaskStatusType }) {
		if(data) {
			this.id = data.id;
			this.title = data.title;
			this.description = data.description;
			this.dueDate = data.dueDate;
			this.priority = data.priority;
			this.category = data.category;
			this.assignedTo = data.assignedTo;
			this.subtasks = data.subtasks;
			this.status = data.status;
		}
	}

	/**
     * Returns a JSON-string from tast.
     * 
     * @returns - the task data as JSON.
    */
	toJSON(): object {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			dueDate: this.dueDate,
			priority: this.priority,
			category: this.category,
			assignedTo: this.assignedTo,
			subtasks: this.subtasks
		}
	}
}