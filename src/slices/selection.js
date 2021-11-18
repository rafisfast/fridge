import { createSlice } from '@reduxjs/toolkit'

export const selection = createSlice({
  name: 'selection',
  initialState: {
    selected : "",
    anchors  : [],
    stage : {}
  },
  reducers: {
    setselected: (state,value) => {
      state.selected = value.payload
    },
    setanchors : (state,value) => {
      state.anchors = value.payload
    },
    setstage : (state,value) => {
      state.stage = value.payload
    }
  }
})

export const { setselected, setanchors, setstage } = selection.actions
export default selection.reducer