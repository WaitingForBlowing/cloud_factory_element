import service from "@/utils/request";

export function getTypeList(param) {
    return service({
        url: '/product/types',
        method: 'get',
        params: param
    })
}

export function getAll() {
    return service({
        url: '/product/types/all',
        method: 'get'
    })
}

export function addType(param) {
    return service({
        url: '/product/type',
        method: 'post',
        data: param
    })
}

export function selectTypeById(param) {
    return service({
        url: `/product/type/${param}`,
        method: 'get',
    })
}

export function updateTypeById(param) {
    return service({
        url: '/product/type',
        method: 'put',
        data: param
    })
}

export function removeTypeById(param) {
    return service({
        url: `/product/type/${param}`,
        method: 'delete'
    })
}

export function getProductList(param) {
    return service({
        url: '/product/infos',
        method: 'get',
        params: param
    })
}

export function removeProductById(param) {
    return service({
        url: `/product/info/${param}`,
        method: 'delete'
    })
}

export function addProduct(param) {
    return service({
        url: '/product/info',
        method: 'post',
        data: param
    })
}

export function selectProductById(param) {
    return service({
        url: `/product/info/${param}`,
        method: 'get',
    })
}

export function updateProductById(param) {
    return service({
        url: '/product/info',
        method: 'put',
        data: param
    })
}

export function getAllProduct() {
    return service({
        url: '/products/all',
        method: 'get',
    })
}
