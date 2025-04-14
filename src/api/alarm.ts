import { get } from '@/utils/http'
enum Api {
    alarmList = "/alarmList"
}
function alarmListApi(): Promise<any> {
    return get(Api.alarmList)
}

export { alarmListApi }