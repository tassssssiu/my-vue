import { post } from '@/utils/http'
enum Api {
    mapList = '/mapList'
}
function mapListApi(): Promise<any> {

    return post(Api.mapList)
}
export { mapListApi }