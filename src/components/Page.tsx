import React from 'react';
import {ToastContainer} from "react-toastify";
import Header from "./Header";

export const Page = (props) => {
  return (
      <div className={'page'}>
          <ToastContainer/>
          <Header logOut={props.logOut} renderScramble={window.location.pathname === '/'}/>
          {props.children}
      </div>
  )
};