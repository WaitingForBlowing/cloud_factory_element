import service from "@/utils/request";

export function chooseTender(param) {
    return service({
        url: '/tender',
        method: 'put',
        data: param
    })
}

export function getTenderInfo(param) {
    return service({
        url: `/tender/${param}`,
        method: 'get'
    })
}

export function determineTender(param) {
    return service({
        url: `/tender/select/${param}`,
        method: 'put'
    })
}
