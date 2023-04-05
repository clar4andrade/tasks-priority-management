import { useTasksContext } from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {'x-access-token': user.token},
      body: JSON.stringify({ status: 'DELETED' })
    })
    const json = await res.json()

    if (res.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json})
    }
  }

  return (
    <div>
      <h4>{task.name}</h4>
      <p>{task.description}</p>
      <p>{task.urgency}</p>
      <p>{task.importance}</p>
      <p>{task.priority}</p>
      <p>{task.priority_stage}</p>
      <span onClick={handleClick}>delete</span>
    </div>
  )
}

export default TaskDetails