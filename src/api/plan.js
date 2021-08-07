import service from "@/utils/request";

export function getSchedulingList(param) {
    return service({
        url: `/schedulings/${param}`,
        method: 'get'
    })
}

export function addScheduling(param) {
    return service({
        url: '/scheduling',
        method: 'post',
        data: param
    })
}
