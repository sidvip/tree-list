import { configureStore } from '@reduxjs/toolkit'
import treeReducer from './treeReducer';


/**
 * Initializes the redux store
 */
export const store = configureStore({
    reducer: {
        tree: treeReducer,
    },
})

