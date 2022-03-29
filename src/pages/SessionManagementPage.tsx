import {Alert, Card, CardContent, Collapse} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {SolveSelectionTable} from "../components/SolveSelectionTable";
import {useSelector} from "react-redux";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from "axios";
import {toast} from "react-toastify";
import {ISolveSession, Solve} from "../redux/reducers/solveReducer";
import {UrlHelper} from "../utils/url-helper";
import SessionSelectionDropDown from "../components/SessionSelectionDropDown";
import sessionSelectors from "../redux/selectors/sessionSelectors";

export const SessionManagementPage = () => {
    const user = useSelector(sessionSelectors.user);
    const [sourceSolves, setSourceSolves] = useState([]);
    const [sourceSession, setSourceSession] = useState(null);
    const [targetSolves, setTargetSolves] = useState([]);
    const [targetSession, setTargetSession] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(true);
    useEffect(() => {
        if (sourceSession) {
            getSolves(setSourceSolves, sourceSession);
        }
    }, [sourceSession]);
    useEffect(() => {
        if (targetSession) {
            getSolves(setTargetSolves, targetSession);
        }
    }, [targetSession]);
    const getSolves = async (setSolves: (solves: Solve[]) => void, session: ISolveSession) => {
        if (user) {
            const userId = user.attributes.email;
            const response = await axios.get<{ body: { solves: Solve[] } }>(`${UrlHelper.getScrambleApiDomain()}solves?userId=${encodeURIComponent(userId)}&sessionId=${session.sessionId}`);
            const body = response.data.body;
            setSolves(body.solves)
        } else {
            toast.error('There must be a logged in user to get solves.');
        }
    };
    const transferSolvesToSession = () => {
        if(sourceSession === targetSession) {
            toast.error('Your source session cannot be the same as your target session.');
        } else if (!sourceSession || !targetSession) {
            toast.error('You must have a source and target session selected.');
        }
    };

    return (
        <div className={'session-management-container'}>
            <Card className={'flex-row session-management-card'}>
                <CardContent className={'flex-column session-management-card-content'}>
                    <Collapse in={isAlertOpen} sx={{width: '100%'}}>
                        <Alert onClose={() => setIsAlertOpen(false)} severity="info">
                            To swap solves between sessions, select your source and target sessions and select the
                            solves you wish to move.
                        </Alert>
                    </Collapse>
                    <h2>Session Management</h2>
                    <div className={'flex-row session-swap-container'}>
                        <div className={'source-session-solves-container flex-column'}>
                            <SessionSelectionDropDown onChange={async (session) => setSourceSession(session)}
                                                      allowAdd={false}/>
                            <SolveSelectionTable solves={sourceSolves}/>
                        </div>
                        <div className={'swap-action-container'}>
                            <ArrowRightAltIcon className={'right-arrow'} onClick={transferSolvesToSession}/>
                        </div>
                        <div className={'target-session-solves-container'}>
                            <SessionSelectionDropDown
                                onChange={async (session) => setTargetSession(session)}
                                allowAdd={false}
                            />
                            <SolveSelectionTable
                                selectable={false}
                                solves={targetSolves}/>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}