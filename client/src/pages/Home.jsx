import { useEffect, useState }from 'react'
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import TaskDetails from '../components/TaskDetails'
import TaskForm from '../components/TaskForm'
import Stage from '../components/Stage'

const findEquals = (tasks, priority_stage) => {
  let result = []
  tasks.forEach((task) => {
      if(priority_stage  === task.priority_stage) {
          result.push(task)
      }
  })

  return result
}

const Home = () => {
  const {tasks, dispatch} = useTasksContext()
  const {user} = useAuthContext()
  const [ form, setForm ] = useState(false)
  const stages = [
    {id:1, name: 'Do Now'}, 
    {id:2, name: 'Delegate'},
    {id: 3, name: 'Plan'},
    {id: 4, name: 'Solve Later'}
  ]

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`api/tasks/${user._doc._id}`,{
        headers: {'x-access-token': user.token}
      })

      const json = await res.json()
      if (res.ok) {
        dispatch({type: 'SET_TASKS', payload: json.tasks})
      }

    }

    if (user) {
      fetchTasks()
    }
  }, [dispatch, user, tasks])

  return (
    <div className="home">
      <div>
        {tasks && tasks.map((task) => (
          <TaskDetails key={task.id} task={task} />
        ))}
      </div>
      <div>
        <h2>Priority Stage</h2>
        {(tasks && stages) && stages.map((stage)=> (
          <Stage key={stage.id} name={stage.name} tasks={findEquals(tasks, stage.id)}/>
        ))}
      </div>
      <button onClick={() => setForm(true)}>
        +
      </button>
      {form && <TaskForm setForm={setForm} />}
    </div>
  )
}

export default Home