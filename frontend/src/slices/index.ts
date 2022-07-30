import { configureStore } from '@reduxjs/toolkit';
import loggerReducer from '../slices/logger-slice';

export default configureStore({
  reducer: {
    logger: loggerReducer,
  },
});