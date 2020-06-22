import { createStore } from 'redux';

const initialState = {
    userState: 'notAuthorized',
    userName: '',
    cards: [],
    statuses: [],
    currentFolder: 'root',
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'loginSuccess': {
            return {
                ...state,
                userState: 'authorized',
                userName: action.payload.userName
            };
        }
        case 'logout': {
            return {
                ...state,
                userState: 'notAuthorized',
                userName: ''
            };
        }
        case 'getCards': {
            return {
                ...state,
                cards: action.payload
            };
        }
        case 'getStatuses': {
            return {
                ...state,
                statuses: action.payload
            };
        }
       
        case 'updateCard': {
            const cards = [
                ...state.cards
            ]

            const newCards = cards.map(item => {
                if (item.id === action.payload.id) {
                    item = action.payload;
                    
                    return item;
                }

                return item
            });

            return {
                ...state,
                cards: newCards
            }
        }


        case 'deleteCard': {
            const cards = [
                ...state.cards
            ]

            const newCards = cards.filter(item => item.id !== action.payload.id);

            return {
                ...state,
                cards: newCards
            }
        }

        case 'deleteStatus': {
            const statuses = [
                ...state.statuses
            ]

            const newStatuses = statuses.filter(item => item.id !== action.payload.id);

            return {
                ...state,
                statuses: newStatuses
            }
        }

        default: return state;
    }
}

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;