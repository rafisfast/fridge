import { createSlice } from '@reduxjs/toolkit'

export const store = createSlice({
  name: 'counter',
  initialState: {
    value:0,
    name:"John"
  },
  reducers: {
    increment: (state) => {
      state.value+=1
    },
    decrement: (state) => {
      state.value -=1
    },
    incrementByAmount: (state,a) => {
      state.value = a.payload
    },
    changeName: (state) => {
      console.log(state.name)
      state.name = state.name.split("").filter((e)=>{
        return e === "h"
      }).join("")
    }
  }
})

export const { increment, decrement, incrementByAmount, changeName } = store.actions
export default store.reducer