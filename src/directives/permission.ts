//按钮自定义指令 个人页面 去处理 需要根据数组来进行判断
import { useUserStore } from "@/store/auth"
export default {
    beforeMount(el: any, binding: any) {
        const userStore = useUserStore()
        const { roles } = userStore
        const requirePerminssion = binding.value
        if (!roles.includes(requirePerminssion)) {
            el.style.display = 'none'
        }
    }
}