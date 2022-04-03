import React from "react";
import './Setting.css';

export function Setting(props: { title: string, children }) {
    return <div className={"setting"}>
        <p className={"setting-label"}>{props.title}</p>
        {props.children}
    </div>;
}