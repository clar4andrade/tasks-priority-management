import { useState } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from '../hooks/useAuthContext'

const TaskForm = ({ setForm }) => {
  const { dispatch } = useTasksContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState(0)
  const [importance, setImportance] = useState(0)
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const task = {user_id: user._doc._id, name: name, description: description, urgency: urgency, importance: importance, status: 'CREATED'}

    const res = await fetch('api/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': user.token
      }
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (res.ok) {
      setName('')
      setDescription('')
      setUrgency(0)
      setImportance(0)
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
  }

  return (
    <div>
      <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>

        <label>Task Name:</label>
        <input 
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className={emptyFields?.includes('name') ? 'error' : ''}
        />

        <label>Description:</label>
        <input 
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
        />

        <label>Urgency</label>
        <input 
          type="number"
          onChange={(e) => setUrgency(e.target.value)}
          value={urgency}
          className={emptyFields?.includes('urgency') ? 'error' : ''}
        />

        <label>Importance</label>
        <input 
          type="number"
          onChange={(e) => setImportance(e.target.value)}
          value={importance}
          className={emptyFields?.includes('importance') ? 'error' : ''}
        />

        <button>Add Task</button>
        {error && <div className="error">{error}</div>}
      </form>
      <button onClick={() => setForm(false)} >Close</button>
    </div>
  )
}

export default TaskForm