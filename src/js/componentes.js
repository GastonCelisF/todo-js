import { Todo } from "../classes";
import { todoList } from '../index';

//Referencias en el Html
const divTodoList = document.querySelector('.todo-list');
const txtInput = document.querySelector('.new-todo');
const btnBorrar = document.querySelector('.clear-completed');
const ulFiltros = document.querySelector('.filters');
const anchorFiltros = document.querySelectorAll('.filtro')

export const crearTodoHtml = (todo) => {


  //uso de operador ternario con interpolacion de string para el manejo de tarea complatado o no
  // al ser nuestro valor bool podes indicar que si true agregue la clase completed caso contrario no agregue nada..
  const htmltodo = `<li class="${(todo.completado) ? 'completed' : ''}" data-id="${todo.id}">
						<div class="view">
							<input class="toggle" type="checkbox" ${(todo.completado ? 'checked' : '')} >
							<label>${todo.tarea}</label>
							<button class="destroy"></button>
						</div>
						<input class="edit" value="Create a TodoMVC template">
					</li>`;

  const div = document.createElement('div');
  div.innerHTML = htmltodo;

  divTodoList.append(div.firstElementChild);

  return div.firstElementChild;
}



//Eventos


txtInput.addEventListener('keyup', (event) => {
  // Buscamos el keycode(codigo de las teclas), en este caso enter y asi es como
  // creamos la logica para que cuando usemos entre y no keyup, para tener algo mas exacto..
  // Ademas agregamos la condicion para evitar de enviar un value vacio.. cuando el usuario aprete enter primero
  if (event.keyCode === 13 && txtInput.value.length > 0) {
    const nuevoTodo = new Todo(txtInput.value);
    console.log(txtInput.value);
    todoList.nuevoTodo(nuevoTodo);
    crearTodoHtml(nuevoTodo);
    txtInput.value = '';

  }
});


divTodoList.addEventListener('click', (event) => {

  const nombreElemento = (event.target.localName);// Input,lbl,btn
  const todoElemento = event.target.parentElement.parentElement;
  const todoId = todoElemento.getAttribute('data-id');//recupera el id mediente el atributo..

  if (nombreElemento.includes('input')) {//click en el check
    todoList.marcarCompletado(todoId);
    // todoelemento referencia del html, referencias a todoas las clases classlist  y si quiero cambiar una clase con toggle, para cambiar completed
    todoElemento.classList.toggle('completed');
  } else if (nombreElemento.includes('button')) { // hay que borrar el todo porque estamos haciendo click al btn eliminar

    todoList.eliminarTodo(todoId);
    divTodoList.removeChild(todoElemento);
  }

  console.log(todoList);
});

// podria mandar el evento pero no me sirve
// yo se que al hacer click dispare mi accion
btnBorrar.addEventListener('click', (event) => {
  todoList.eliminarCompletados();

  //necesitamos referencias a todos los hijos que haya en divtodolist
  //ya que se debe borrar el array desde abajo hacia arriba evitando posibles errores, como borrar un todo no completado


  for (let i = divTodoList.children.length - 1; i >= 0; i--) {
    //preguntar si el elemento actual del cual estamos barriendo esta completado ono
    const elemento = divTodoList.children[i];
    //como sabremos si el elemento esta completado o no?
    // una es ver si el input esta con la clase check
    // o lo mas sencillo es buscar la clase completed
    // con CONTAINS vemos si un elemento tiene dicha clase
    if (elemento.classList.contains('completed')) {
      divTodoList.removeChild(elemento);
    }
  }




});



ulFiltros.addEventListener('click', (event) => {

  const filtro = event.target.text;
  if (!filtro) { return; }
  anchorFiltros.forEach(elem => elem.classList.remove('selected'));
  event.target.classList.add('selected');

  for (const elemento of divTodoList.children) {
    elemento.classList.remove('hidden');
    const completado = elemento.classList.contains('completed');

    switch (filtro) {
      case 'Pendientes':
        if (completado) {
          elemento.classList.add('hidden');
        }
        break;
      case 'Completados':
        if (!completado) {
          elemento.classList.add('hidden');
        }
        break;
    }
  }

});