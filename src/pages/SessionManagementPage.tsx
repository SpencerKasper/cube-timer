import {Card, CardContent} from '@mui/material';
import React from 'react';
import {Page} from "../components/Page";

export const SessionManagementPage = () => {
    return (
        <div className={'session-management-container'}>
            <Card className={'flex-row session-management-card'}>
                <CardContent>
                    <h2>Session Management</h2>
                </CardContent>
            </Card>
        </div>
    )
}