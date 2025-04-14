<!-- 充电桩管理页面 -->

<template>
    <el-card>
        <!-- select选择器组件 远程搜索 来做模糊查询 -->
        <!-- v-model 的值为当前被选中的 el-option 的 value 属性值 -->
        <el-select style="width: 300px;" placeholder="选择站点名称" v-model="value" filterable>
            <el-option v-for="item in options" :key="item.id" :value="item.name">{{ item.name }}</el-option>
        </el-select>
    </el-card>
    <el-card class="mt">
        <!-- element radio v-model  选中项绑定值   change是绑定值变化时触发的事件-->
        <el-radio-group size="large" v-model="radio" @change="handlechange">
            <el-radio-button :label="`全部(${allCount})`" :value="0" />
            <el-radio-button :label="`空闲中(${checkCount(1)})`" :value="1" />
            <el-radio-button :label="`充电中(${checkCount(2)})`" :value="2" />
            <el-radio-button :label="`连接中(${checkCount(3)})`" :value="3" />
            <el-radio-button :label="`排队中(${checkCount(4)})`" :value="4" />
            <el-radio-button :label="`已预约(${checkCount(5)})`" :value="5" />
            <el-radio-button :label="`故障离线(${checkCount(6)})`" :value="6" />
        </el-radio-group>
    </el-card>
    <el-card class="mt">
        <el-row :gutter="20">
            <el-col :span="6" v-for="item in dataListCopy" :key="item.id">
                <div class="item">
                    <div class="pic">
                        <p v-if="item.status === 1">空闲中</p>
                        <p v-if="item.status === 2">充电中</p>
                        <p v-if="item.status === 3">连接中</p>
                        <p v-if="item.status === 4">排队中</p>
                        <p v-if="item.status === 5">已预约</p>
                        <p v-if="item.status === 6">故障离线</p>
                        <img :src="item.status === 1 ? free : (item.status === 6 ? outline : ing)" alt="" width="100px">
                        <p v-if="item.status === 2">{{ item.percent }} </p>
                        <p v-else=>0%</p>
                    </div>
                    <div class="info">
                        <h3>
                            {{ item.id }}
                        </h3>
                        <hr class="mb">
                        <p>电压：{{ item.volatge }}</p>
                        <p>电流：{{ item.current }}</p>
                        <p>功率：{{ item.power }}</p>
                        <p>温度：{{ item.tem }}</p>
                    </div>
                </div>
                <div class="btn">
                    <div class="divder"></div>
                    <div>
                        <p class="fl ml" style="font-size: 12px;color: #999;">暂无预警</p>
                        <div style="text-align: right;" class="fr">
                            <el-button size="small">维保记录</el-button>

                            <!--element Popover弹出框-->
                            <!-- 像 Tooltip一样，Popover 可以由虚拟元素触发，这个功能就很适合使用在触发元素和展示内容元素是分开的场景。通常我们使用 #reference 来放置我们的触发元素 -->
                            <el-popover placement="right" :width="400" trigger="click">
                                <template #reference>
                                    <el-button type="primary" size="small" class="mr">使用记录</el-button>
                                </template>
                                <!-- element timeline 时间线 -->
                                <el-timeline style="max-width: 600px">
                                    <el-timeline-item timestamp="12:08:17">
                                        充电80度，消费80元
                                    </el-timeline-item>
                                    <el-timeline-item timestamp="13:12:09">
                                        re
                                    </el-timeline-item>
                                    <el-timeline-item timestamp="13:15:22">
                                        充电60度，消费60元
                                    </el-timeline-item>
                                    <el-timeline-item timestamp="16:22:33">
                                        充电70度，消费70元
                                    </el-timeline-item>
                                    <el-timeline-item timestamp="17:27:17">
                                        充电100度，消费100元
                                    </el-timeline-item>
                                    <el-timeline-item timestamp="18:08:33">
                                        充电80度，消费80元
                                    </el-timeline-item>
                                </el-timeline>
                            </el-popover>

                        </div>
                    </div>

                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup lang="ts">
import free from "@/assets/free.png"
import outline from '@/assets/outline.png'
import ing from '@/assets/ing.png'
import { currentListApi } from '@/api/chargingstation'
import { onMounted, ref, computed, watch } from "vue"

// options用于存下拉选择框时所需要的数据，因为有模糊查询功能，所以列表数据再单独存在datalist里
// option 充电站
const options = ref<any>([])
// dataList用于存列表数据 充电桩
const dataList = ref<any>([])//原始数据
const dataListCopy = ref<any>([])//备份数据
const loadData = async () => {
    const { data } = await currentListApi()
    // console.log(data)
    options.value = data
    dataList.value = data[0].list
    dataListCopy.value = data[0].list//备份数据用于做列表渲染
}
onMounted(() => {
    loadData()
})

const radio = ref<number>(0)


// 空闲中 等有几个
function checkCount(num: number) {
    return dataList.value.filter((item: any) => item.status === num).length
}
// 全部有几个
const allCount = computed(() => checkCount(1) + checkCount(2) + checkCount(3) + checkCount(4) + checkCount(5) + checkCount(6)
)

const handlechange = () => {
    // 每一次filter需要 在全部数据中进行 因此需要进行一个重置
    dataListCopy.value = dataList.value
    // 选择的不是"全部“
    if (radio.value != 0) {
        // dataList.value = dataList.value.filter((item: any) => item.status === radio.value) 这样写的bug是原始数据会被修改，用于计算 计算属性也会被修改 因此需要进项数据备份
        // datalist 功能 1 用于计算属性的计算 2用于重置
        dataListCopy.value = dataListCopy.value.filter((item: any) => item.status === radio.value)
    }
}

//select选择框 选中之后 下面的 充电桩列表进行 变化
const value = ref('')
watch(value, () => {
    // v-model 的值value 为当前被选中的 el-option 的值 
    const res = options.value.filter((item: any) => item.name === value.value)
    console.log(res)
    dataListCopy.value = res[0].list
    dataList.value = res[0].list
    // 把高亮切回“全部”
    radio.value = 0
})
</script>
<style lang="less" scoped>
.item {
    justify-content: center;
    background-color: rgb(247, 251, 254);
    height: 200px;
    border-radius: 10px 10px 0 0;
    padding: 20px;
    display: flex;
    align-items: center;
    margin-top: 20px;

    .pic {
        p {
            width: 76px;
            text-align: center;
            margin-bottom: 10px;
            color: rgb(61, 187, 146);
        }
    }

    .info {
        color: #999;
        margin-left: 30px;
        line-height: 26px;
        margin-top: -10px;
    }
}

.btn {
    background-color: #f7fbfe;
    width: 100%;
    height: 50px;
    line-height: 50px;

}

.divder {
    background-color: #f4f4f4;
    height: 2px;
    width: 95%;
    margin: auto;
}

.record {

    height: 60px;
    line-height: 60px;
    text-align: center;

    box-sizing: border-box;
}
</style>