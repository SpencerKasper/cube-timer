import {useSelector} from "react-redux";
import sessionSelectors from "../../redux/selectors/sessionSelectors";
import React, {useEffect, useState} from "react";
import {ISolveSession, Solve} from "../../redux/reducers/solveReducer";
import axios from "axios";
import {UrlHelper} from "../../utils/url-helper";
import {toast} from "react-toastify";
import {Alert, Card, CardContent, Collapse} from "@mui/material";
import SessionSelectionDropDown from "../drop-downs/SessionSelectionDropDown";
import {SolveSelectionTable} from "../SolveSelectionTable";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import reduxStore from "../../redux/redux-store";

export function SolveSwapBetweenSessionsCard() {
    const user = useSelector(sessionSelectors.user);
    const [sourceSolves, setSourceSolves] = useState<Solve[]>([]);
    const [selectedSourceSolves, setSelectedSourceSolves] = useState<string[]>([]);
    const [sourceSession, setSourceSession] = useState<ISolveSession>(null);
    const [targetSolves, setTargetSolves] = useState<Solve[]>([]);
    const [targetSession, setTargetSession] = useState<ISolveSession>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(true);

    const getSourceSessionSolves = async () => {
        if (sourceSession) {
            await getSolves(setSourceSolves, sourceSession);
        }
    };

    const getTargetSessionSolves = async () => {
        if (targetSession) {
            await getSolves(setTargetSolves, targetSession);
        }
    };

    useEffect(() => {
        getSourceSessionSolves();
    }, [sourceSession]);

    useEffect(() => {
        getTargetSessionSolves();
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
    const transferSolvesToSession = async () => {
        if (sourceSession === targetSession) {
            toast.error('Your source session cannot be the same as your target session.');
        } else if (!sourceSession || !targetSession) {
            toast.error('You must have a source and target session selected.');
        } else {
            const response = await axios.post(`${UrlHelper.getSolveSessionApiDomain()}sessions/transfer`, {
                sourceSolveIds: selectedSourceSolves,
                targetSessionId: targetSession.sessionId,
                userId: user.attributes.email,
            });
            await getSourceSessionSolves();
            await getTargetSessionSolves();
        }
    };
    return <Card className={"flex-row session-management-card"}>
        <CardContent className={"flex-column session-management-card-content"}>
            <Collapse in={isAlertOpen} sx={{width: "100%"}}>
                <Alert onClose={() => setIsAlertOpen(false)} severity="info">
                    To swap solves between sessions, select your source and target sessions and select the
                    solves you wish to move.
                </Alert>
            </Collapse>
            <h2>Swap Solves Between Sessions</h2>
            <div className={"flex-row session-swap-container"}>
                <div className={"source-session-solves-container flex-column"}>
                    <SessionSelectionDropDown
                        onChange={async (session) => setSourceSession(session)}
                        allowAdd={false}/>
                    <SolveSelectionTable onSelectedChanged={(value) => setSelectedSourceSolves(value)}
                                         solves={sourceSolves}/>
                </div>
                <div className={"swap-action-container"}>
                    <ArrowRightAltIcon className={"right-arrow"} onClick={transferSolvesToSession}/>
                </div>
                <div className={"target-session-solves-container"}>
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
    </Card>;
}