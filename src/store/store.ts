import { configureStore } from '@reduxjs/toolkit';
import { booksApi } from './api/booksApi';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;