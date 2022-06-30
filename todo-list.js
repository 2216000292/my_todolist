let todoList = [];

function addTodoItem(task,due) {
  const todoItem = {
    task,
    done: false,
    id: Date.now(),
    due
  };

  todoList.push(todoItem); //global元素todolist，加载一个task进去
  refreshTodoList(todoItem);  //刷新页面

  saveLocalStorage();
}

function refreshTodoList(todoItem) {
  const ul = document.querySelector("#todo-list");
  const oldItem = document.querySelector(`[data-id="${todoItem.id}"]`);
// above，由于每个时间id都是独一无二的，设定选择器操作参数相对应id的item
  if (todoItem.deleted) {  //不太确定是干嘛的?如果被标记为已删除？
    oldItem.remove();
    return;
  }

  let due_date = Math.ceil(date_calculator(todoItem.due));   //向下取整


  const li = document.createElement("li");  //新创单个item
  const isDone = todoItem.done ? "done" : "";
  li.setAttribute("data-id", todoItem.id); //设置新创item的id
  li.setAttribute("class", `todo-item ${isDone}`);   //设置新创item的类名
  li.innerHTML = `<label for="${todoItem.id}" class="tick"></label>
  <input type="checkbox" id="${todoItem.id}">
  <span>${todoItem.task}</span>
  <span class=due_date>${due_date} days left</span>
  <button class="delete"><img src="images/remove.png"></button>`;

  if (oldItem) {
    ul.replaceChild(li, oldItem);
  } else {
    ul.insertBefore(li, ul.firstElementChild);
  }
}

function date_calculator(date_future){
  date_now = new Date();
  //x = date_future.getTime();
  return (date_future - date_now.getTime())/86400000;
}


function toggleDone(id) {
  const index = todoList.findIndex(todoItem => todoItem.id === Number(id));

  todoList[index].done = !todoList[index].done;
  refreshTodoList(todoList[index]);
  saveLocalStorage();
}

function deleteTodoItem(id) {
  const index = todoList.findIndex(todoItem => todoItem.id === Number(id));
  todoList[index].deleted = true;
  refreshTodoList(todoList[index]);
  todoList = todoList.filter(todoItem => todoItem.id !== Number(id));

  saveLocalStorage();
}

function saveLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todoList));
}

const form = document.querySelector("#todo-form");   //多用途元素选择器可以用 . or #

form.addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#todo-input");
  let input_date = document.getElementById("datepicker").value;
  let year = input_date.slice(6,10);
  let month = input_date.slice(0,2);
  let day = input_date.slice(3,5);
  //console.log(year);console.log(month);console.log(day);
  dateObj = new Date(year,month-1,day);   //Object
  your_due = dateObj.getTime();
  //dateObj_now = new Date();
  //console.log((dateObj.getTime()-dateObj_now.getTime())/86400000);

  const task = input.value.trim(); 
  if (task !== "" && year !== "") {   //Obj不是为空 这里用year来测试
    addTodoItem(task,your_due);
    input.value = "";
  } else {
      if(task == ""){
        alert("Please enter an item");
      }
      else{
        alert("Please select a date");
      }
  }
});

const ul = document.querySelector("#todo-list");
ul.addEventListener("click", event => {
  console.log(event.target);
  const id = event.target.parentElement.dataset.id;
  if (event.target.classList.contains("tick")) {
    toggleDone(id);
  } else if (event.target.classList.contains("delete")) {
      console.log(`Delete ID = ${id}`);
      deleteTodoItem(id);
      console.log(todoList);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const todoListString = localStorage.getItem("todo-list");

  if (todoListString) {
    todoList = JSON.parse(todoListString);
    for (let i = 0; i < todoList.length; i++) {
      refreshTodoList(todoList[i]);
    }
  }
});