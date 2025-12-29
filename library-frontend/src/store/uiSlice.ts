import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    activeTab: 'catalog' | 'my-books';
    currentUserId: number;
}

const initialState: UIState = {
    activeTab: 'catalog',
    currentUserId: 1, // Default to demo user
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<'catalog' | 'my-books'>) => {
            state.activeTab = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.currentUserId = action.payload;
        }
    },
});

export const { setActiveTab, setUserId } = uiSlice.actions;
export default uiSlice.reducer;
