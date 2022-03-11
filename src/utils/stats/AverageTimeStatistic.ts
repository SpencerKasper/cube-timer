import {Statistic} from "./Statistic";
const ACCOUNT_FOR_MIN_AND_MAX_REMOVAL = 2;

export class AverageTimeStatistic extends Statistic {
    constructor(times: number[]) {
        super(times);
    }

    getStatValue(fractionDigits = 2) {
        const statValue = super.getStatValue();
        if (statValue) {
            return statValue;
        }
        const sumOfMostRecent = this.getSumOfSolveTimes();
        const averageTimeStat = sumOfMostRecent / this.times.length;
        return averageTimeStat.toFixed(fractionDigits).toString();
    }

    getLabel(): string {
        return `Average of Last ${this.times.length + 2}`;
    }

    getDescription(): string {
        const numberOfSolves = this.times.length;
        return `This is the average of ${numberOfSolves + ACCOUNT_FOR_MIN_AND_MAX_REMOVAL} with the fastest and slowest time removed.  The remaining ${numberOfSolves} times are averaged together.`
    }

    private getSumOfSolveTimes() {
        return this.times
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }
}