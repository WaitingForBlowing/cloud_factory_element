const user = {
    state: {
        token: '',
        role_id: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLE: (state, id) => {
            state.role_id = id
        }
    },
    actions: {}
}

export default user
