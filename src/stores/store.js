import { configureStore } from '@reduxjs/toolkit'
import refsReducer from '../slices/refs'
import selectionReducer from '../slices/selection'

export default configureStore({
  reducer: {
    refs: refsReducer,
    selection: selectionReducer
  },
})