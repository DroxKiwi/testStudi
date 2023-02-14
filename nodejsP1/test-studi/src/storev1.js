import { combineReducers, createStore } from 'redux';

const userInitialState = {
  id: null, 
  username: null, 
  authToken: null
};

const userReducer = (state = userInitialState, action) => {
  switch(action.type) {
    case 'LOGIN_USER':
      return {...action.payload};
    case 'LOGOUT_USER':
      return {...userInitialState};
    default:
      return state;
  };
};

const errorsReducer = (state = { errors: [] }, action) => {
  switch(action.type) {
    case 'ADD_ERROR':
      return {errors: [...state.errors, action.payload]};
    case 'RESET_ERRORS':
      return {errors: []};
    default:
      return state;
  };
};

const rootReducer = combineReducers({
    users: userReducer,
    errors: errorsReducer
  });
  
const store = createStore(rootReducer);

console.log(store.getState());

export default store