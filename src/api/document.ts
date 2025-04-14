import { get } from '@/utils/http'
enum Api {
    TypeList = '/document'
}
function TypeListApi(): Promise<any> {

    return get(Api.TypeList)
}
export { TypeListApi }