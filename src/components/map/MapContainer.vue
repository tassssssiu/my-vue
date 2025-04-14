<!-- 地图组件 -->
<template>
    <div id="container"></div>
</template>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, ref, onUnmounted } from "vue"
import { mapListApi } from '@/api/map';
import icon from '@/assets/flashIcon.png'
import station from '@/assets/station.jpg'
let map: any = null
const markersData = ref([])
onMounted(() => {
    AMapLoader.load({
        key: "7066344199d5d8c8bd499c1d4bfc1984", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                // 设置地图容器id
                viewMode: "3D", // 是否为3D地图模式
                zoom: 5, // 初始化地图级别 缩放级别
                center: [116.397428, 39.90923], // 初始化地图中心点位置
            });

            // 添加自定义标记  高德开放平台点标记->自定义标记点
            mapListApi().then(({ data }) => {
                markersData.value = data
                // 创建信息窗体
                const infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -30),
                })
                markersData.value.forEach((markerData: any) => {
                    const marker = new AMap.Marker({
                        position: markerData.position,
                        icon: icon, //添加 icon 图标 URL
                        title: "北京",
                    });
                    marker.on('click', () => {
                        // 这里点击最后查看AMap.InfoWindow全部属性和方法 里的setContent 这里是在设置窗体内容
                        infoWindow.setContent(`
                        <div style="display:flex;padding:10px;align-items:center;">
                  <div>
                    <img src="${station}" width="200px"/>  
                  </div>
                  <div style="width:180px;line-height:30px;margin-left:20px">
                    <h3>${markerData.title}</h3> 
                    <p>充电桩数量：${markerData.count}</p> 
                    <p >充电站状态：<span style="color:blue">${markerData.status == 1 ? "使用中" : "维护中"}</span></p> 
                  </div>           
                </div>`)
                        // 这里点击最后查看AMap.InfoWindow全部属性和方法 里的open 和  getPosition方法
                        // open(map, position, height) 
                        // getPosition() 获取文本标记位置
                        infoWindow.open(map, marker.getPosition());
                    })
                    map.add(marker);
                })


            })




        })
        .catch((e) => {
            console.log(e);
        });
});
// 关闭时卸载地图资源
onUnmounted(() => {
    map?.destroy();
});

</script>
<style lang="less">
#container {
    width: 100%;
    height: 80vh;
}
</style>