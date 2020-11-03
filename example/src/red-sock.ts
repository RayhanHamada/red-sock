import { connectSocketToRedux } from '@mocchapine/red-sock';
import { store } from './store';

export const socket = connectSocketToRedux(store, 'http://localhost:3000').on(
  ({ dispatch }) => ({
    increment: () => {
      dispatch({
        type: 'INCREMENT',
      });
    },
    decrement: () => {
      dispatch({
        type: 'DECREMENT',
      });
    },
  })
);
