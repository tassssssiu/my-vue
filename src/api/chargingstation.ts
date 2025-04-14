import { post, get } from '@/utils/http'
import type { RowType } from '@/types/station/index'
interface ListType {
    page: number,
    pageSize: number,
    name?: string,
    id?: string,
    status: number
}
interface RevenueType {
    page: number,
    pageSize: number,
    name: string
}

enum Api {
    List = '/stationList',
    Edit = '/station/edit',
    Delete = '/station/delete',
    RevenueChart = "/revenueChart",
    Revenue = "/revenueList",
    CurrentList = "currentList"
}


function listApi(data: ListType) {
    return post(Api.List, data)
}
function EditApi(data: RowType) {
    return post(Api.Edit, data)
}
function DeleteApi(id: string) {
    return post(Api.Delete, { id })
}
function chartApi() {
    return get(Api.RevenueChart)
}
function revenueApi(data: RevenueType) {
    return post(Api.Revenue, data)
}
function currentListApi(): Promise<any> {
    return post(Api.CurrentList, { name })
}
export { listApi, EditApi, DeleteApi, chartApi, revenueApi, currentListApi }