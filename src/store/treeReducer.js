import { createSlice } from '@reduxjs/toolkit'
import data from '../db/data.json';

const initialState = {
    initialTree: data,
    distortedTree: null,
}

export const counterSlice = createSlice({
    name: 'tree',
    initialState,
    reducers: {
        getInitialTree: (state) => {
            return initialState.initialTree;
        },
        setDistortedTree: (state, action) => {
            state.distortedTree = action.payload;
        },
        updateSelectedNodes: (state, action) => {
            /**
             * Selected nodes are updated through this reducer.
             */
            state.initialTree.selectedNodes = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { getInitialTree, setDistortedTree, updateSelectedNodes } = counterSlice.actions

export default counterSlice.reducer