import React from 'react';
import {SolveSwapBetweenSessionsCard} from "../components/cards/SolveSwapBetweenSessionsCard";
import {ManageSessionsCard} from "../components/cards/ManageSessionsCard";

export const SessionManagementPage = () => {
    return (
        <div className={'session-management-container'}>
            <div className={'card-container'}>
                <ManageSessionsCard/>
            </div>
            <div className={'card-container'}>
                <SolveSwapBetweenSessionsCard/>
            </div>
        </div>
    )
}