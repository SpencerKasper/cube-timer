import {Statistic} from "./Statistic";

export class AverageTimeStatistic extends Statistic {
    private times: number[];

    constructor(times: number[]) {
        super();
        this.times = times;
    }

    getStatValue(fractionDigits = 2) {
        const sumOfMostRecent = this.getSumOfSolveTimes();
        const averageTimeStat = sumOfMostRecent / this.times.length;
        return averageTimeStat.toFixed(fractionDigits).toString();
    }

    private getSumOfSolveTimes() {
        return this.times
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }
}