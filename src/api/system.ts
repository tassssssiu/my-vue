import { post } from "../utils/http"
enum Api {
    auth = '/userAuth',
    setAuth = '/setAuth'
}
function getAuthApi(pageAuthority: string): Promise<any> {
    return post(Api.auth, { pageAuthority })
}
function setAuthApi(account: string, btn: string[], pageList: string[]): Promise<any> {
    return post(Api.setAuth, { account, btn, pageList })
}

export { getAuthApi, setAuthApi }