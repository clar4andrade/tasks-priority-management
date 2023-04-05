import PriorityRateService from "../priorityRate"

describe('When rating the priority', () => {
    it('Should return the right correct rate', () => {
        const PriorityRate = new PriorityRateService(5,5)
        const result = PriorityRate.getPriorityInformation()

        expect(result.priority).toBe(25)
    })

    it('Should return a 1 priority stage for an urgent and impotant task', () => {
        const PriorityRate = new PriorityRateService(5,4)
        const result = PriorityRate.getPriorityInformation()
    
        expect(result.priority_stage).toBe(1)
    })

    it('Should return a 2 priority stage for low importance point and high urgency', () => {
        const PriorityRate = new PriorityRateService(3,2)
        const result = PriorityRate.getPriorityInformation()
    
        expect(result.priority_stage).toBe(2)
    })

    it('Should return a 3 priority stage for a low urgency and high importance task', () => {
        const PriorityRate = new PriorityRateService(1,4)
        const result = PriorityRate.getPriorityInformation()

        expect(result.priority_stage).toBe(3)
    })

    it('Should return a 4 priority stage for a low urgency and low importance task', () => {
        const PriorityRate = new PriorityRateService(1,2)
        const result = PriorityRate.getPriorityInformation()

        expect(result.priority_stage).toBe(4)
    })
})