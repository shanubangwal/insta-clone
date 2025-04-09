import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:[],
    },
    reducers:{
        setAuthUser:(state,action) =>{
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) =>{
            state.suggestedUsers = action.payload;
        },
        setSelectedUser:(state,action) =>{
            state.selectedUser = action.payload;
        },
        setUserProfile:(state,action) =>{
            state.userProfile = action.payload;
        },
    }


});
export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser} = authSlice.actions;
export default authSlice.reducer;
