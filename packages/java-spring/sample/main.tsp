model Task {
  name: string;
  description: string;
  age: integer;
}
op doWork(task: Task): string;
op doMoreWork(task: Task): string;
