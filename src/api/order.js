import service from "@/utils/request";

export function getOrderList(param) {
    return service({
        url: '/orders',
        method: 'get',
        params: param
    })
}

export function getWinOrderList(param) {
    return service({
        url: `/orders/win`,
        method: 'get',
        params: param,
    })
}

export function getOrderWithTenderList(param) {
    return service({
        url: '/orders/tender',
        method: 'get',
        params: param
    })
}

export function takeOverOrder(param) {
    return service({
        url: `/order/${param}/over`,
        method: 'put'
    })
}

export function addOrder(param) {
    return service({
        url: '/order',
        method: 'post',
        data: param
    })
}

export function endProduce(param) {
    return service({
        url: `/order/${param}/end`,
        method: 'put'
    })
}

export function deliver(param) {
    return service({
        url: `/order/${param}/deliver`,
        method: 'put'
    })
}

export function accomplish(param) {
    return service({
        url: `/order/${param}/accomplish`,
        method: 'put'
    })
}
