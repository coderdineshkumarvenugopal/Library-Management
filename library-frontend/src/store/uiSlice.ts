import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    activeTab: 'catalog' | 'my-books';
    currentUserId: number;
    theme: 'light' | 'dark';
}

const initialState: UIState = {
    activeTab: 'catalog',
    currentUserId: 1, // Default to demo user
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
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
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
        }
    },
});

export const { setActiveTab, setUserId, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
