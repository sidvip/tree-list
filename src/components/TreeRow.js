import { useSelector } from 'react-redux';
import './tree.css';
import React from "react";

export default function TreeRow({ label, indent, id }) {

    const { initialTree } = useSelector((state) => state.tree);

    return (
        <div className="Row" style={{ marginLeft: indent + "px", marginTop: "10px" }} data-row-id={id}>
            {
                initialTree.selectedNodes.includes(id) ? <input type='checkbox' className="checkbox" checked /> :
                    <input type='checkbox' className="checkbox" />}
            <label>{label}</label>
        </div>
    );
}