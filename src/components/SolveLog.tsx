import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import './SolveLog.css';
import {Solve} from "../redux/reducers/solveReducer";
import solveSelectors from "../redux/selectors/solveSelectors";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {SolveCard} from "./SolveCard";
import {Card, CardContent, Chip} from "@mui/material";
import {ArrowUpward} from "@mui/icons-material";
import {toast} from "react-toastify";

const SolveLog = () => {
    const [scrollHeight, setScrollHeight] = useState(0);
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);
    const selectedSession = useSelector(solveSelectors.selectedSession);
    const getSolves = async () => {
        if (user) {
            const userId = user.attributes.email;
            const response = await axios.get<{ body: { solves: Solve[] } }>(`${UrlHelper.getScrambleApiDomain()}solves?userId=${encodeURIComponent(userId)}&sessionId=${selectedSession.sessionId}`);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}})
        } else {
            toast.error('There must be a logged in user to get solves.');
        }
    };
    useEffect(() => {
        if (user) {
            getSolves();
        }
    }, [user, selectedSession]);
    const solves = useSelector(solveSelectors.solves);
    const onScroll = () => {
        setScrollHeight(document.getElementById('solves').scrollTop);
    };
    const scrollToTop = () => {
        document.getElementById('solves').scrollTo({top: 0, behavior: "smooth"});
    };
    return (
        <div className='solve-history-container'>
            <h2 className='solve-history-title'>Log</h2>
            <div className='solves' id='solves' onScroll={onScroll}>
                {
                    scrollHeight !== 0 &&
                    <div className={'scroll-to-top-chip'}>
                        <Chip onClick={scrollToTop} icon={<ArrowUpward/>} label='Scroll to Top'
                              className='scroll-to-top-chip'/>
                    </div>
                }
                {solves.length ? solves.sort((a, b) => a.number > b.number ? -1 : 1).map((solve: Solve, index) => {
                        return <SolveCard key={index}
                                          solveNumber={solves.length - index}
                                          solve={solve}/>
                    }) :
                    <Card>
                        <CardContent>
                            No Solves Yet! Press the spacebar to start the timer...
                        </CardContent>
                    </Card>}
            </div>
        </div>
    );
};

export default SolveLog;