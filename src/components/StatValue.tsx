import {Statistic} from "../utils/stats/Statistic";
import {TimeFormatter} from "../utils/TimeFormatter";
import React from "react";

export function StatValue(props: { statistic: Statistic; label: string }) {
    const timeFormatter = new TimeFormatter();
    const statValue = props.statistic.getStatValue();
    return <div className='stat'>
        <p className='stat-label'>
            {props.label}:
        </p>
        <p>
            {statValue ? timeFormatter.getFullTime(statValue) : "-"}
        </p>
    </div>;
}