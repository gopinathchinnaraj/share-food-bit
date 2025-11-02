import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userSlice } from './user-slice';

const persistConfig = {
  key: 'user',
  storage,
};

// Persist the user slice in session
const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

// Create the store and configure it with the persisted reducer
export const store = configureStore({
  reducer: {
    [userSlice.name]: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);