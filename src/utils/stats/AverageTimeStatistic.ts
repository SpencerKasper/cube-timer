import {Statistic} from "./Statistic";

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
        return `Average of Last ${this.times.length}`;
    }

    getDescription(): string {
        const numberOfSolves = this.times.length;
        const ACCOUNT_FOR_MIN_AND_MAX_REMOVAL = 2;
        const numberOfSolvesIncludedInAverage = this.times.length - ACCOUNT_FOR_MIN_AND_MAX_REMOVAL;
        return `This is the average of ${numberOfSolves} with the fastest and slowest time removed.  The remaining ${numberOfSolvesIncludedInAverage} times are averaged together.`
    }

    private getSumOfSolveTimes() {
        return this.times
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }
}