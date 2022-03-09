export class TimeFormatter {
    getMinutes(currentTime) {
        return currentTime >= 60000 ? (currentTime / 60000).toString().split('.')[0] : '0';
    }

    getSeconds(currentTime, decimalPlaces = 2) {
        const seconds = this.getSecondsSplitByDecimalPoint(currentTime, decimalPlaces)[0];
        return seconds.length === 1 && currentTime >= 60000 ? `0${seconds}` : seconds;
    }

    getMilliseconds(currentTime, decimalPlaces = 2) {
        const milliseconds = this.getSecondsSplitByDecimalPoint(currentTime, decimalPlaces)[1];
        return currentTime === 0 ? '00' : milliseconds;
    }

    getFullTime(currentTime) {
        if (currentTime === '-') {
            return currentTime;
        }
        return currentTime < 60000 ? `${this.getSeconds(currentTime)}.${this.getMilliseconds(currentTime)}` : `${this.getMinutes(currentTime)}:${this.getSeconds(currentTime)}.${this.getMilliseconds(currentTime)}`
    }

    private getSecondsSplitByDecimalPoint(currentTime, decimalPlaces: number) {
        return ((currentTime / 1000) - (Number(this.getMinutes(currentTime)) * 60)).toFixed(decimalPlaces).toString().split('.');
    }
}