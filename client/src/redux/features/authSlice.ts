import { getUserData } from "@/Service/apiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  userName: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthSliceState {
  loader: boolean;
  user: User | null;
}

const initialState: AuthSliceState = {
  loader: true,
  user: null,
};

export const fetchUserData = createAsyncThunk<User, void>(
  "auth/fetchUserData",
  async () => {
     const response = (await getUserData()) as { data: User };
    //@ts-ignore
    return response?.data?.data
  }
);

export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loader = false;
    },
    removeUserData: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loader = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loader = false;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.loader = false;
        state.user = null;
      });
  },
});

export const { setUserData, removeUserData } = authSlice.actions;
