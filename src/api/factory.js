import service from "@/utils/request";

export function getFactoryList(param) {
    return service({
        url: '/factories',
        method: 'get',
        params: param
    })
}

export function changeStatus(param) {
    return service({
        url: `/factory/status/${param}`,
        method: 'put',
    })
}
