export const actionTypes = {
    getCards: (cards) => ({
        type: 'getCards',
        payload: cards
    }),

    getStatuses: (statuses) => ({
        type: 'getStatuses',
        payload: statuses
    }),

    updateCardOnFrontend: (card) => ({
        type: 'updateCard',
        payload: card
    }),

    deleteCardFromFrontend: (card) => ({
        type: 'deleteCard',
        payload: card
    }),

    deleteStatusFromFrontend: (status) => ({
        type: 'deleteStatus',
        payload: status
    }),

    login: (name) => ({
        type: 'loginSuccess',
        payload: name
    }),

    logout: () => ({
        type: 'logout'
    })
}