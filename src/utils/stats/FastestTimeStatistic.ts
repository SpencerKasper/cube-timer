import {Statistic} from "./Statistic";

export class FastestTimeStatistic extends Statistic {
    constructor(times: number[]) {
        super(times);
    }

    getStatValue(fractionDigits = 2) {
        const statValue = super.getStatValue();
        if(statValue) {
            return statValue;
        }
        return (Math.min(...this.times)).toFixed(fractionDigits).toString();
    }

    getLabel() {
        return 'Fastest Time';
    }

    getDescription(): string {
        return `This is the fastest time of all the times in the current log.`
    }
}