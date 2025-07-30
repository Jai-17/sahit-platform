import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./features/NavigationSlice";
import { apiSlice } from "./features/apiSlice";
import { protectedApiSlice } from "./features/protectedApiSlice";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  navigation: navigationReducer,
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [protectedApiSlice.reducerPath]: protectedApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: {ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],}, }).concat(
        apiSlice.middleware,
        protectedApiSlice.middleware
      ),
  });

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
