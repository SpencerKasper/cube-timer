export class Statistic {
    times: number[];

    constructor(times) {
        this.times = times;
    }
    getStatValue(): string {
        if(!this.times || !this.times.length) {
            return this.getDefaultValue();
        }
        return null;
    }

    getDefaultValue(): string {
        return '-';
    }

    getLabel(): string {
        return '';
    }

    getDescription(): string {
        return '';
    }
}