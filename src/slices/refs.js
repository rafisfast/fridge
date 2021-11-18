import { createSlice } from '@reduxjs/toolkit'

export const refs = createSlice({
  name: 'refs',
  initialState: {
    list : []
  },
  reducers: {
    add: (state,value) => {
      state.list.push(value.payload)
    },
    remove: (state,value) => {
      state.list = state.list.filter(e=>e!==value.payload)
    },
    reset: (state) => {
      return state
    }
  }
})

export const { add, remove, reset } = refs.actions
export default refs.reducer