const btnAdd = document.querySelector('#push'),
      inputNewTask = document.querySelector('#newtask input'),
      tasks = document.querySelector('#tasks');

btnAdd.addEventListener('click', function(){
  if(inputNewTask.value.length == 0){
      alert("Kindly Enter Task Name!!!!")
  } else{
    tasks.innerHTML += `
          <div class="task">
              <span id="taskname">
                  ${inputNewTask.value}
              </span>
              <button class="delete">
                  <i class="far fa-trash-alt"></i>
              </button>
          </div>
      `;

    let current_tasks = document.querySelectorAll(".delete");

    for(let i=0; i<current_tasks.length; i++){
      current_tasks[i].onclick = function(){
        current_tasks[i].parentNode.remove();
      }
    }
  }
});
