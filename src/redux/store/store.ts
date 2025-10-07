// redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import dashSearchReducer from '../features/search/DashSearchSlice'
import globalSearchReducer from "../features/search/GlobalSearchSlice"


export const store = configureStore({
  reducer: {
    dashSearch: dashSearchReducer,
    globalSearch: globalSearchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
