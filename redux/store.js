import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./features/likesSlice";
import postModalReducer from "./features/postModalSlice";
import friendsModalReducer from "./features/friendsModalSlice";
import commentsReducer from "./features/commentsSlice";
import accountReducer from "./features/accountSlice";

export const store = configureStore({
  reducer: {
    likes: likesReducer,
    postModal: postModalReducer,
    friendsModal: friendsModalReducer,
    comments: commentsReducer,
    account: accountReducer,
  },
});


/* NOTES */

/* STORE:
The store is a centralized place to store the entire state of your application. 
Redux uses a single store that houses the state tree. 
This means the state of your whole application is stored in an object tree within a single store.
*/

/* REDUCERS: 
Reducers are pure functions that take the current state and an action as arguments and return a new state.
They specify how the application's state changes in response to an action. 
Reducers should always be pure functions, meaning they don't mutate the existing state directly but return a new copy of the state with the necessary changes.
*/

/* ACTIONS:
Actions are plain JavaScript objects that represent an intention to change the state. 
Actions have a type field that indicates the type of action being performed. 
They can also have a payload field that contains the data or information that is needed to perform the action.
For example, in a 'like' action, the payload might contain the ID of the post that is being liked.
*/

/* IMMUTABILITY:
Redux requires that you do not mutate the state directly. 
Instead, you should create a copy of the state, make changes to that copy, and then return the new copy. 
This is important for maintaining the predictability and traceability of state changes. 
Redux Toolkit, with its createSlice function, uses Immer library under the hood, which allows you to write "mutating" logic in reducers but it actually produces the immutable state copies. 
*/

/* useDispatch: 
This hook is used to dispatch actions to the Redux store. 
Actions are payloads of information that send data from your application to your store. 
They are the only source of information for the
/*

/* REDUX FLOW: 
The flow of data in Redux is unidirectional:
1.) Dispatch Action: An action is dispatched when you want to change the state. This action is sent to the store.
2.) Reducers Handle Action: The store forwards the action to the reducer function. The reducer creates a new state based on the action.
3.) Store Updates State: The Redux store saves the new state returned by the reducer.
4.) UI Updates: The UI then updates to reflect the new state.

Using Redux ensures that state changes are predictable and traceable, making it easier to understand, debug, and reason about your application.
*/