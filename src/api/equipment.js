import service from "@/utils/request";

export function getEquipmentList(param) {
    return service({
        url: `/equipments/${param}`,
        method: 'get'
    })
}
