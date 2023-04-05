import { Controller, Post, Get, Patch, Middleware } from "@overnightjs/core";
import { Request, Response } from 'express'
import { BaseRepository } from '@src/repositories/'
import { Tasks } from '@src/models/tasks'
import { BaseController } from ".";
import { authMiddleware } from "@src/middlewares/auth";
import PriorityRateService from '@src/services/priorityRate'

@Controller('api/tasks')
export default class TasksController extends BaseController{
    constructor(private tasksRepository: BaseRepository<Tasks>) {
        super()
    }

    @Post('')
    @Middleware(authMiddleware)
    public async createTask(req: Request, res: Response): Promise<void> {
        const PriorityInfo = new PriorityRateService(req.body.urgency, req.body.importance)
        const { priority, priority_stage } = PriorityInfo.getPriorityInformation()

        try {
            const task = await this.tasksRepository.create({
                ...req.body,
                priority,
                priority_stage
            })
            res.status(201).send(task)
        } catch (err) {
            this.sendCreateUpdateErrorResponse(res, err)
        }
    }

    @Get(':user_id')
    @Middleware(authMiddleware)
    public async getUsersTasks(req: Request, res: Response): Promise<Response> {
        const tasks = await this.tasksRepository.find({user_id: req.params.user_id})
        
        return res.send({tasks})

    }

    @Patch(':id')
    @Middleware(authMiddleware)
    public async updateTask(req: Request, res: Response): Promise<void> {
        const task_id = req.params.id
        const update = req.body
        try {
            const updated = await this.tasksRepository.findByIdAndUpdate(task_id, update, {
              new: true,
            })
            res.status(200).send(updated)
        } catch (err) {
            this.sendCreateUpdateErrorResponse(res, err)
        }
    }

}