import { reactive, ref } from "vue";

export function usePagination(loadData: () => Promise<any>, initalPageSize = 10) {
    const totals = ref<number>(0)
    const pageInfo = reactive({
        page: 1,
        pageSize: initalPageSize
    })
    const handleSizeChange = (size: number) => {
        pageInfo.pageSize = size
        loadData()
    }
    const handleCurrentChange = (page: number) => {
        pageInfo.page = page
        loadData()
    }
    const resetpagination = () => {
        pageInfo.page = 1
        pageInfo.pageSize = 10
        loadData()
    }
    const setTotals = (all: number) => {
        totals.value = all
    }
    return { totals, pageInfo, handleSizeChange, handleCurrentChange, resetpagination, setTotals }
}