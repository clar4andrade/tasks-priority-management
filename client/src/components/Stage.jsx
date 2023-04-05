
const Stage = ({ name, tasks }) => {
    return (
        <div>
            <h3>{name}</h3>
            {tasks.map((task) => (
                <div key={task.id}>
                    <p>{task.name}</p>
                    <p>{task.priority_stage}</p>
                </div>
            ))}
        
        </div>
    )
}

export default Stage