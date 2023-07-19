import { configureStore } from '@reduxjs/toolkit'
import treeReducer from './treeReducer';

export const store = configureStore({
    reducer: {
        tree: treeReducer,
    },
})

