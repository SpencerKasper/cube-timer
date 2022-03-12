import {Statistic} from "./Statistic";

export class FastestTimeStatistic extends Statistic {
    constructor(times: number[]) {
        super(times);
    }

    getStatValueBeforeFormat() {
        return Math.min(...this.times);
    }

    getStatValue(fractionDigits = 2) {
        const statValue = super.getStatValue();
        if(statValue) {
            return statValue;
        }
        return this.getStatValueBeforeFormat().toFixed(fractionDigits).toString();
    }

    getLabel() {
        return 'Fastest Time';
    }

    getDescription(): string {
        return `This is the fastest time of all the times in the current log.`
    }
}