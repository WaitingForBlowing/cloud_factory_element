import service from "@/utils/request";

export function getMenuList(id) {
    return service({
        url: `/menus/${id}`,
        method: 'get'
    })
}
