import {Card, CardContent} from '@mui/material';
import React from 'react';
import {Page} from "../components/Page";
// import {SolveSelectionTable} from "../components/SolveSelectionTable";
8
export const SessionManagementPage = () => {
    return (
        <div className={'session-management-container'}>
            <Card className={'flex-row session-management-card'}>
                <CardContent className={'flex-column session-management-card-content'}>
                    <h2>Session Management</h2>
                    <div className={'flex-row session-swap-container'}>
                        <div className={'source-session-solves-container'}>
                            {/*<SolveSelectionTable />*/}
                        </div>
                        <div className={'swap-action-container'}>hello</div>
                        <div className={'target-session-solves-container'}>yo</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}