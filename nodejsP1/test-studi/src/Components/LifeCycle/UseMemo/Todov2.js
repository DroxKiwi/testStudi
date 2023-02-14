import React, {useState, useEffect, useMemo} from 'react';
 
const Todov2 = () => {
  const [filterIsDone, setFilterIsDone] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const getTodoList = () => {
    return [
      {
        title : 'Apprendre React',
        isDone: false,
      },
      {
        title : 'Apprendre le HTML',
        isDone: true,
      },
      {
        title : 'Apprendre le JS',
        isDone: true,
      },
    ];
  };

  /**
   * Récupération de la liste des todo au montage du composant
   */
  useEffect(() => {
    setTodoList(getTodoList());
  },[]);
 
  /**
   * filtredTodoList utilise la mémoïsation du résultat de la fonction,
   * celle-ci sera recalculée seulement si filterIsDone ou todoList subissent une mutation.
   */
  const filtredTodoList = useMemo(() => {
    return (
      todoList.filter((todo) => (
        todo.isDone === filterIsDone
      ))
    );
  }, [filterIsDone, todoList]);
 
  return (
    <>
      <h1> TODO {filterIsDone ? " terminés ": "  à faire"} :</h1>
      <ul>
        {
          filtredTodoList.map((todo)=> (
            <li key={todo.title}>{todo.title}</li>
          ))
        }
      </ul>
      <button onClick={() => setFilterIsDone(!filterIsDone)}>
        {filterIsDone ? "afficher les TODO à faire": "afficher les TODO terminés"}
      </button>
    </>
  );
}

export default Todov2;
