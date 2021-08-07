import service from '@/utils/request'

export function login (param) {
    return service({
        url: '/login',
        method: 'post',
        data: param,
    })
}

export function register(param) {
    return service({
        url: '/register',
        method: 'post',
        data: param,
    })
}

export function logout() {
    return service({
        url: '/logout',
        method: 'get'
    })
}

export function getList(param) {
    return service(({
        url: '/users',
        method: 'get',
        params: param
    }))
}

export function addUser(param) {
    return service({
        url: '/user',
        method: 'post',
        data: param
    })
}

export function removeUserById(param) {
    return service({
        url: `/user/${param}`,
        method: 'delete'
    })
}

export function selectUserById(param) {
    return service({
        url: `/user/${param}`,
        method: 'get'
    })
}

export function updateUserById(param) {
    return service({
        url: '/user',
        method: 'put',
        data: param
    })
}
