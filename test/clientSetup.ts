import { combineReducers, createStore, Reducer } from 'redux';

type CountState = number;
type CountAct =
  | { type: 'inc' }
  | { type: 'dec' }
  | { type: 'incBy'; payload: number }
  | { type: 'decBy'; payload: number }
  | { type: 'resetCount' };

type Todo = {
  name: string;
  desc: string;
};

type TodoState = Todo[];

type TodoAct =
  | { type: 'addTodo'; payload: Todo }
  | { type: 'removeTodo'; payload: string }
  | { type: 'resetTodo' };

const countState: CountState = 0;
const count: Reducer<CountState, CountAct> = (state = countState, action) => {
  switch (action.type) {
    case 'inc':
      return (state as number) + 1;
    case 'dec':
      return (state as number) - 1;
    case 'incBy':
      return (state as number) + action.payload;
    case 'decBy':
      return (state as number) - action.payload;
    case 'resetCount':
      return 0;
    default:
      return state as number;
  }
};

const todoState: TodoState = [
  {
    name: 'Take clothes',
    desc: 'Take clothes from laundromat',
  },
];

const todos: Reducer<TodoState, TodoAct> = (state = todoState, action) => {
  switch (action.type) {
    case 'addTodo':
      return [...(state as TodoState), action.payload];
    case 'removeTodo':
      return (state as TodoState).filter(todo => todo.name !== action.payload);
    case 'resetTodo':
      return [
        {
          name: 'Take clothes',
          desc: 'Take clothes from laundromat',
        },
      ];
    default:
      return state as TodoState;
  }
};

const rootReducer = combineReducers({
  count,
  todos,
});

export const store = createStore(rootReducer);
