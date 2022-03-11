import {Statistic} from "../utils/stats/Statistic";
import {TimeFormatter} from "../utils/TimeFormatter";
import React from "react";
import {Tooltip} from "@mui/material";

export function StatValue(props: { statistic: Statistic; label: string; description?: string; placementOfDescription?: "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top" }) {
    const timeFormatter = new TimeFormatter();
    const statValue = props.statistic.getStatValue();
    return <div className='stat'>
        {props.description ?
            <Tooltip title={props.description} placement={props.placementOfDescription ? props.placementOfDescription : 'left'}>
                <p className='stat-label'>
                    {props.label}:
                </p>
            </Tooltip> :
            <p className='stat-label'>
                {props.label}:
            </p>
        }
        <p>
            {statValue ? timeFormatter.getFullTime(statValue) : "-"}
        </p>
    </div>;
}