import { TasksMongoDBRepository } from '@src/repositories/tasksMongoDBRepository'
import { UserMongoDBRepository } from '@src/repositories/userMongoDBRepository'
import { Tasks } from '@src/models/tasks'
import AuthService from '@src/services/auth'

let token: string
interface Task {
    user_id: string
    name: string,
    description: string,
    urgency: number,
    importance: number,
    status: string
}
let user_id: string
let test_task: Task
let test_task_2: Tasks

const tasksRepository = new TasksMongoDBRepository()
const userRepository = new UserMongoDBRepository()

beforeEach(async () => {
    await tasksRepository.deleteAll()
    await userRepository.deleteAll()

    const user = await userRepository.create({
        name: 'John',
        surname: 'Doe',
        email: 'doe@gmail.com',
        password: 'abcABC123!'
    })

    user_id = user.id

    test_task = {
        user_id: user_id,
        name: 'task name',
        description: 'task descrip',
        urgency: 5,
        importance: 4,
        status: 'COMPLETED'
    }

    test_task_2 = {
        user_id: user_id,
        name: 'task name',
        description: 'task descrip',
        urgency: 5,
        importance: 4,
        priority: 20,
        priority_stage: 2,
        status: 'COMPLETED'
    }
})

describe('When creating a new task', () => {
    it('should successfully save the task', async () => {
        token = AuthService.generateToken(test_task.user_id)

        const res = await global.testRequest
            .post('/api/tasks')
            .send(test_task)
            .set({ 'x-access-token': token })

        expect(res.status).toBe(201)
        expect(res.body).toEqual(
            expect.objectContaining({
              ...test_task
            })
        )
    })

    it('Should return a validation error when any field is missing', async () => {
        token = AuthService.generateToken(test_task.user_id)

        const { status, ...error_task } = test_task
        const res = await global.testRequest
            .post('/api/tasks')
            .send(error_task)
            .set({ 'x-access-token': token })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            code: 400,
            error: '400',
            message: 'Tasks validation failed: status: Path `status` is required.',
        })
    })
})

describe('When fetching for users tasks', () => {
    it('Should return all users tasks', async () => {
        token = AuthService.generateToken(test_task.user_id)
        const task = await tasksRepository.create(test_task_2)
        
        const res = await global.testRequest
            .get(`/api/tasks/${task.user_id}`)
            .set({ 'x-access-token': token })

        expect(res.status).toBe(200)
        expect(res.body.tasks[0]).toEqual(
            expect.objectContaining({
                ...test_task_2
            })
        )
        
    })
})

describe('When updating a task', () => {
    it('Should return the updated task', async () => {
        token = AuthService.generateToken(test_task.user_id)
        const task = await tasksRepository.create(test_task_2)

        const task_update = {
            priority: 4,
            status: 'DELETED'
        }

        const res = await global.testRequest
          .patch(`/api/tasks/${task.id}/`)
          .set({ 'x-access-token': token })
          .send(task_update)
    
        const updated = res.body
    
        expect(res.status).toBe(200)
        expect(updated).toHaveProperty('priority', task_update.priority)
        expect(updated).toHaveProperty('status', task_update.status)
    })
})
