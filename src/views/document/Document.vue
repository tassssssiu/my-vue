<template>
    <el-card>
        <div class="mt">
            <span calss="title">文章类型</span>
            <el-tag :type="currentIndex[0] === -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 0, '')">全部</el-tag>
            <el-tag :type="currentIndex[0] === index ? 'primary' : 'info'" class=" mr"
                v-for="(item, index) in typeList.type" :key="item" @click="handleSelect(index, 0, item)"> {{
                    item }}</el-tag>
        </div>
        <div class="mt">
            <span calss="title">重要程度</span>
            <el-tag :type="currentIndex[1] == -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 1, '')">全部</el-tag>
            <el-tag :type="currentIndex[1] == index ? 'primary' : 'info'" class="mr"
                v-for="(item, index) in typeList.important" :key="item" @click="handleSelect(index, 1, item)">{{ item
                }}</el-tag>
        </div>
        <div class="mt">
            <span calss="title">发布渠道</span>
            <el-tag :type="currentIndex[2] == -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 2, '')">全部</el-tag>
            <el-tag :type="currentIndex[2] == index ? 'primary' : 'info'" class="mr"
                v-for="(item, index) in typeList.publish" :key="item" @click="handleSelect(index, 2, item)">{{ item
                }}</el-tag>
        </div>
        <!-- 横杠 -->
        <el-divider></el-divider>
        <div class="mt">
            <span class="title">已选</span>
            <!-- closable能让样式加上 叉号 -->
            <!-- disable-transitions禁用el-tag里的动画-->
            <!-- @close 点击叉号关闭 关闭后 前面 要变成全部 =》 因此需要传参 -->
            <el-tag type="success" clss="mr" closable v-for="item in selectList" :key="item" disable-transitions
                @close="handleClose(item.num)">{{
                    item.name }}</el-tag>
        </div>
    </el-card>
    <el-button type="primary" class="mt mb" @click="exportToHtml">导出富文本到HTML文件</el-button>
    <Editor api-key="xvbamfm2vokka8qoim9r801qtdlldskjschd51yha7zhuusp" :init="{
        language: 'zh_CN',
        plugins: 'lists link image table code help wordcount'
    }" v-model="editorContent" />

</template>

<script lang="ts" setup>
import { TypeListApi } from '@/api/document';
import { onMounted, ref } from 'vue';
import Editor from '@tinymce/tinymce-vue'
// el-tag的动态数据渲染
interface ListType {
    type: string[],
    important: string[],
    publish: string[]
}
const typeList = ref<ListType>({ type: [], important: [], publish: [] })
onMounted(async () => {
    const { data } = await TypeListApi()
    typeList.value = data
})
// el-tag 点击高亮
//给-1是希望初始值 不高亮
// 这里要给数组，如果只给一个【-1】的话 三排序号会一样
const currentIndex = ref([-1, -1, -1])

const handleSelect = (index: number, num: number, name: string) => {
    // 这里是 点击动态往 已选 添加标签类
    const ind: number = selectList.value.findIndex((item: selectType) => item.num === num)
    //如果点的是全部 要从已选中删掉 对应这个类别的数据
    if (!name) {
        // filter 返回的是过滤掉的
        selectList.value = selectList.value.filter((item: selectType) => item.num === num)
    } else {
        // 如果没有，则直接添加在 已选 下面
        if (ind === -1) {
            selectList.value.push({ name, num })
            // 如果有，则直接进行修改
        } else {
            selectList.value[ind] = { name, num }
        }
    }
    //这里是el-tag高亮逻辑
    currentIndex.value[num] = index
}
// 已选那里 动态添加标签 1同类别不能添加 2删除时候需要知道是哪个类别的 =》分析得出需要知道是哪个类别的
interface selectType {
    name: string,
    num: number
}
const selectList = ref<selectType[]>([]) //[{name:'招商类',num:0}，{name:'二级'，num：1}]
// 已选 点击叉号关闭
const handleClose = (num: number) => {
    selectList.value = selectList.value.filter((item: selectType) => item.num != num)
    currentIndex.value[num] = -1
}
// 富文本编辑器
const editorContent = ref('')
const exportToHtml = () => {
    // 获取编辑器内容
    // 创建一个 Blob 对象
    const blob = new Blob([editorContent.value], { type: 'text/html' });
    // 创建一个链接元素
    const link = document.createElement('a');
    // 将 Blob 对象的 URL 设置为链接地址
    link.href = URL.createObjectURL(blob);
    // 设置下载文件的名称
    link.download = 'document.html';
    // 触发点击事件以下载文件
    link.click();
    // 释放 URL 对象
    URL.revokeObjectURL(link.href);
}

</script>

<style lang="less" scoped>
.title {
    font-size: 14px;
    display: inline-block;
    width: 80px;
}

.el-tag {
    cursor: pointer;
}
</style>