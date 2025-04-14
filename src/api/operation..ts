import { post, get } from '@/utils/http'
enum Api {
    BatchDelete = '/batchDelete',
    CityList = '/cityList'
}
function BatchDeleteApi(order: string[]): Promise<any> {

    return post(Api.BatchDelete, { order })
}
function cityListApi(): Promise<any> {
    return get(Api.CityList)
}
export { BatchDeleteApi, cityListApi }