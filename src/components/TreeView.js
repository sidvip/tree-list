import './tree.css';
import React, { useEffect, useState } from "react";
import TreeRow from './TreeRow';
import { useDispatch, useSelector } from 'react-redux';
import { setDistortedTree, updateSelectedNodes } from '../store/treeReducer';

export default function TreeView() {

    const INDENT = 20;
    let indentIncrement = 0;
    const INDENT_LEVEL = {};
    const [data, setData] = useState(null);
    const { initialTree, distortedTree } = useSelector((state) => state.tree);
    const dispatch = useDispatch();

    useEffect(() => {
        parseTree(initialTree);
    }, [initialTree]);

    function parseTree(data) {
        const distortedTree = [];
        const tree = data.tree;
        function _pt(childrenArr, parentId) {
            if (childrenArr && childrenArr.length === 0) {
                indentIncrement = 0;
                return;
            }
            for (let i = 0; i < childrenArr.length; i++) {
                indentIncrement += INDENT;
                if (!INDENT_LEVEL[parentId]) {
                    INDENT_LEVEL[parentId] = indentIncrement;
                }
                distortedTree.push({ id: childrenArr[i].id, name: childrenArr[i].name, parentId: parentId });
                // console.log(childrenArr[i].name);
                _pt(childrenArr[i].children, childrenArr[i].id);
            }
        }

        for (let i = 0; i < tree.length; i++) {
            distortedTree.push({ id: tree[i].id, name: tree[i].name, parentId: null });
            INDENT_LEVEL[`root-${i + 1}`] = 0;
            _pt(tree[i].children, tree[i].id);
            distortedTree.push("");
        }
        console.log(distortedTree);
        dispatch(setDistortedTree(distortedTree));
        setData({ distortedTree, INDENT_LEVEL });
    }


    function selectUnselectAll(e) {
        if (e.target.href.indexOf('unselect') > -1) {
            dispatch(updateSelectedNodes([]));
        } else {
            dispatch(updateSelectedNodes(distortedTree.map((ele) => ele.id)));
        }
    }


    function findParentNodeList(nodeId, parentsList) {
        const nodeObj = distortedTree.filter((ele) => ele.id == nodeId)[0];
        console.log(nodeObj);
        parentsList.push(nodeId);
        if (nodeObj.parentId === null) {
            return;
        }
        findParentNodeList(nodeObj.parentId, parentsList);
    }

    function findChildNodesList(nodeId, childrenList) {
        for (let i = 0; i < distortedTree.length; i++) {
            if (nodeId == distortedTree[i].parentId) {
                childrenList.push(distortedTree[i].id);
                findChildNodesList(distortedTree[i].id, childrenList);
            }
        }
    }

    function filterUnselectedNodes(nodeId, parentsList, childrenList) {
        findParentNodeList(nodeId, parentsList);
        findChildNodesList(nodeId, childrenList);
    }

    function updateTreeState(rowId, parentsList, childrenList) {
        if (initialTree.selectedNodes.includes(parseInt(rowId))) {
            const _updatedNodeList = initialTree.selectedNodes.filter((e) => !(e === parseInt(rowId) || childrenList.includes(e)));
            dispatch(updateSelectedNodes(_updatedNodeList));
        } else {
            const _updatedNodeList = initialTree.selectedNodes.concat([...childrenList, parseInt(rowId)]);
            dispatch(updateSelectedNodes(_updatedNodeList));
        }
    }


    return (
        <div className='tree-area'>
            <div className='action'>
                <a href='#select' onClick={selectUnselectAll}>Select All</a>
                <a href='#unselect' onClick={selectUnselectAll}>Unselect All</a>
            </div>
            <div onClick={(e) => {
                const rowId = e.target.closest('div').dataset.rowId;
                if (rowId) {
                    const parentsList = [];
                    const childrenList = [];
                    filterUnselectedNodes(parseInt(rowId), parentsList, childrenList);
                    console.log("Selected Node Id: ", rowId);
                    console.log("Parent NodeIds: ", parentsList);
                    console.log("Child NodeIds: ", childrenList);
                    updateTreeState(rowId, parentsList, childrenList);
                }
            }}>
                {
                    data && data.distortedTree.map((ele) => ele === "" ? <hr color='lightgrey' key={'hr-' + Math.random()} /> :
                        <TreeRow key={ele.id} label={ele.name} indent={data.INDENT_LEVEL[ele.parentId]} id={ele.id} />)
                }
            </div>
        </div>
    );
}