//封装表格查询数据 加分页结构
import { onMounted, reactive, ref, unref } from 'vue'
import { post } from '@/utils/http'
//T和U 是泛型
// T：通常代表你最终想获取的数据类型 U：表示你传入的参数类型（请求参数）
export function useHttp<T>(url: string, iniitialParams: any) {
    const dataList = ref<T[]>([])//用来存表格的
    const loading = ref<boolean>(false)
    const totals = ref<number>(0)
    const pageInfo = reactive({
        page: 1,
        pageSize: 10
    })
    const loadData = async () => {
        loading.value = true
        // unref 为了保证你传的是 普通对象 而不是 ref({ ... })，要先 unref() 一下，取出其原始值。
        // 扩展运算符的使用是为了  合并两个对象  最终发请求时，就会带上完整的查询参数。
        const { data: { list, total } } = await post(url, { ...unref(iniitialParams), ...pageInfo })
        dataList.value = list
        totals.value = total
        loading.value = false

    }
    onMounted(() => {
        loadData()
    })
    const handleSizeChange = (size: number) => {
        // console.log("handleSizeChange")
        pageInfo.pageSize = size;
        loadData();
    };

    const handleCurrentChange = (page: number) => {
        // console.log("handleCurrentChange")
        pageInfo.page = page;
        loadData();
    };

    const resetPagination = () => {
        pageInfo.page = 1;
        pageInfo.pageSize = 10;
        loadData();
    };
    return {
        dataList,
        loading,
        loadData,
        totals,
        pageInfo,
        handleSizeChange,
        handleCurrentChange,
        resetPagination,
    }
}