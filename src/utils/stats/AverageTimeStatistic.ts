import {Statistic} from "./Statistic";
const ACCOUNT_FOR_MIN_AND_MAX_REMOVAL = 2;

export class AverageTimeStatistic extends Statistic {
    private numberOfSolvesToAverage: number;

    constructor(times: number[], numberOfSolvesToAverage = 5) {
        super(times);
        this.numberOfSolvesToAverage = numberOfSolvesToAverage;
    }

    getStatValue(fractionDigits = 2) {
        if(this.times && this.times.length >= this.numberOfSolvesToAverage - 2) {
            const statValue = super.getStatValue();
            if (statValue) {
                return statValue;
            }
            const sumOfMostRecent = this.getSumOfSolveTimes();
            const averageTimeStat = sumOfMostRecent / this.times.length;
            return averageTimeStat.toFixed(fractionDigits).toString();
        } else {
            return this.getDefaultValue();
        }
    }

    getLabel(): string {
        return `Average of Last ${this.numberOfSolvesToAverage}`;
    }

    getDescription(): string {
        return `This is the average of ${this.numberOfSolvesToAverage} with the fastest and slowest time removed.  The remaining ${this.numberOfSolvesToAverage - 2} times are averaged together.`
    }

    private getSumOfSolveTimes() {
        return this.times
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }
}