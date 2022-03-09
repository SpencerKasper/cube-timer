import {Statistic} from "./Statistic";

const ACCOUNT_FOR_REMOVAL_OF_MIN_AND_MAX = 2;

export class AverageTimeStatistic extends Statistic {
    private times: number[];

    constructor(times: number[]) {
        super();
        this.times = times;
    }

    getStatValue(fractionDigits = 2) {
        const sumOfMostRecentWithoutMinOrMax = this.getSumOfSolveTimesWithoutMaxOrMin();
        const averageTimeStat = sumOfMostRecentWithoutMinOrMax / (this.times.length - ACCOUNT_FOR_REMOVAL_OF_MIN_AND_MAX);
        return averageTimeStat.toFixed(fractionDigits).toString();
    }

    private getSumOfSolveTimesWithoutMaxOrMin() {
        return this.times
            .sort((a, b) => a > b ? -1 : 1)
            .filter((item, index) => index !== 0 && index !== this.times.length - 1)
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }
}