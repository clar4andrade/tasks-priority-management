interface PriorityRateResponse {
    priority: number,
    priority_stage: number
}
export default class PriorityRateService {
    constructor(private urgency: number, private importance: number) {}

    public getPriorityInformation(): PriorityRateResponse {

        const priority = this.PriorityCalculation(this.urgency, this.importance)
        const priority_stage = this.PriorityStageCalc(this.urgency, this.importance)

        return { priority, priority_stage }
    }

    private PriorityCalculation(urgency: number, importance: number): number {
        return urgency * importance
    }

    private PriorityStageCalc(urgency: number, importance: number): number {

        const highUrgency = this.isUrgencyHigh(urgency)
        const highImportance = this.isImportanceHigh(importance)

        if(highUrgency && highImportance) return 1
        if(highUrgency && !highImportance) return 2
        if(!highUrgency && highImportance) return 3

        return 4
    }

    private isUrgencyHigh(urgency: number): boolean {
        return urgency > 2 ? true : false
    }

    private isImportanceHigh(importance: number): boolean {
        return importance > 2 ? true : false
    }

}