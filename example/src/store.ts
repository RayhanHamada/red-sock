import { combineReducers, createStore, Reducer } from 'redux';

type CountAction =
  | {
      type: 'INCREMENT';
    }
  | {
      type: 'DECREMENT';
    };

type CountState = number;

const initialState: CountState = 0;

const countReducer: Reducer<CountState, CountAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state as number;
  }
};

const rootReducer = combineReducers({
  countReducer,
});

export const store = createStore(rootReducer);

export type Store = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
