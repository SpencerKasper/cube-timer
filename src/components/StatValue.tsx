import {Statistic} from "../utils/stats/Statistic";
import {TimeFormatter} from "../utils/TimeFormatter";
import React from "react";
import {Tooltip} from "@mui/material";

export function StatValue(props: { statistic: Statistic; overrideLabelInStat?: string; overrideDescriptionInStat?: string; placementOfDescription?: "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top" }) {
    const timeFormatter = new TimeFormatter();
    const statValue = props.statistic.getStatValue();
    const label = props.overrideLabelInStat ? props.overrideLabelInStat : props.statistic.getLabel();
    const description = props.statistic.getDescription();
    return <div className='stat'>
        {description ?
            <Tooltip title={description}
                     placement={props.placementOfDescription ? props.placementOfDescription : 'left'}>
                <p className='stat-label'>
                    {label}:
                </p>
            </Tooltip> :
            <p className='stat-label'>
                {label}:
            </p>
        }
        <p className='stat-value'>
            {statValue ? timeFormatter.getFullTime(statValue) : "-"}
        </p>
    </div>;
}