import RubiksCubeIcon from "../../static/images/cube.png";
import ScrambleDisplayRow from "../ScrambleDisplay";
import React from "react";
import {useSelector} from "react-redux";
import sessionSelectors from "../../redux/selectors/sessionSelectors";
import {Avatar, IconButton, Link, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {withRouter} from "react-router";
import {UrlHelper} from "../../utils/url-helper";

function Header(props) {
    const user = useSelector(sessionSelectors.user);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return <div className='scramble-display-row'>
        <div className='logo' onClick={() => props.history.push('/')}>
            <h1 className='logo-title'>
                SolveLog
            </h1>
            <div>
                <img src={RubiksCubeIcon} width={48} height={48}/>
            </div>
        </div>
        {user && props.renderScramble ? <ScrambleDisplayRow/> : <div></div>}
        <div className='log-out-and-user-name'>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar alt="" src=""/>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem>
                    <Link color={'secondary'} target={'_blank'} rel={'noopener noreferrer'} href={'/sessions'}>
                        <Typography textAlign={'center'}>Manage Sessions</Typography>
                        <OpenInNewIcon/>
                    </Link>
                </MenuItem>
                <MenuItem onClick={props.logOut}>
                    <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
            </Menu>
        </div>
    </div>;
}

export default withRouter(Header);