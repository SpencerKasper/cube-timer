import React, {useState} from 'react';
import {Alert, AlertColor, Collapse} from "@mui/material";

export const CollapsableAlert = ({text, severity = 'info'}: {text: string; severity?: AlertColor}) => {
    const [isAlertOpen, setIsAlertOpen] = useState(true);

    return (
        <Collapse in={isAlertOpen} sx={{width: "100%"}}>
            <Alert onClose={() => setIsAlertOpen(false)} severity={severity}>
                {text}
            </Alert>
        </Collapse>
    );
}