import { Component, OnInit } from "@angular/core";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/models/task";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"]
})
export class TaskComponent implements OnInit {
  searchText = "";
  showForm = false;
  editForm = false;
  myTask: Task = {
    label: "",
    completed: false
  };
  tasks: Task[] = [];

  resultTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.taskService.findAll().subscribe(tasks => {
      this.resultTasks = this.tasks = tasks;
    });
  }

  deleteTask(id) {
    this.taskService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id != id);
    });
  }

  persistTask() {
    this.taskService.persist(this.myTask).subscribe(task => {
      this.tasks = [task, ...this.tasks];
      this.resetTask();
      this.showForm = false;
    });
  }

  resetTask() {
    this.myTask = {
      label: "",
      completed: false
    };
  }

  toggleCompleted(task) {
    this.taskService.completed(task.id, task.completed).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  editTask(task) {
    this.myTask = task;
    this.editForm = true;
    this.showForm = true;
  }

  updateTask() {
    this.taskService.update(this.myTask).subscribe(task => {
      this.resetTask();
      this.editForm = false;
      this.showForm = false;
    });
  }

  searchTasks() {
    this.resultTasks = this.tasks.filter(task =>
      task.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
