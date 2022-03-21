import {ITimerSettings} from "../redux/reducers/settingsReducer";
import {TimerInfo} from "../components/SettingsRow";

export class TimeFormatter {
    private timerSettings: ITimerSettings;
    private timerInfo: TimerInfo;

    constructor(timerInfo?: TimerInfo, timerSettings?: ITimerSettings) {
        this.timerSettings = timerSettings;
        this.timerInfo = timerInfo;
    }

    getMinutes(currentTime) {
        const hideTimeResult = this.possiblyHideTime();
        if (hideTimeResult) {
            return hideTimeResult;
        }
        return currentTime >= 60000 ? (currentTime / 60000).toString().split('.')[0] : '0';
    }

    getSeconds(currentTime, decimalPlaces = 2) {
        const hideTimeResult = this.possiblyHideTime(decimalPlaces);
        if (hideTimeResult) {
            return hideTimeResult;
        }
        const seconds = this.getSecondsSplitByDecimalPoint(currentTime, decimalPlaces)[0];
        return seconds.length === 1 && currentTime >= 60000 ? `0${seconds}` : seconds;
    }

    getMilliseconds(currentTime, decimalPlaces = 2) {
        const hideTimeResult = this.possiblyHideTime(decimalPlaces);
        if (hideTimeResult) {
            return hideTimeResult;
        }
        const milliseconds = this.getSecondsSplitByDecimalPoint(currentTime, decimalPlaces)[1];
        return currentTime === 0 ? '00' : milliseconds;
    }

    getFullTime(currentTime) {
        if (currentTime === '-') {
            return currentTime;
        }
        return currentTime < 60000 ? `${this.getSeconds(currentTime)}.${this.getMilliseconds(currentTime)}` : `${this.getMinutes(currentTime)}:${this.getSeconds(currentTime)}.${this.getMilliseconds(currentTime)}`
    }

    isTimeHidden() {
        return Boolean(this.possiblyHideTime());
    }

    private possiblyHideTime(decimalPlaces = 1) {
        if (
            this.timerSettings &&
            this.timerSettings.hideTimeDuringSolve &&
            this.timerInfo &&
            !['ready', 'inspecting', 'starting'].includes(this.timerInfo.timerState)
        ) {
            return [...Array(decimalPlaces).keys()].reduce((a, b) => `${a}-`, '');
        }
        return null;
    }

    private getSecondsSplitByDecimalPoint(currentTime, decimalPlaces: number) {
        return ((currentTime / 1000) - (Number(this.getMinutes(currentTime)) * 60)).toFixed(decimalPlaces).toString().split('.');
    }
}