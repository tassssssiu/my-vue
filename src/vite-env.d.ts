/// <reference types="vite/client" />
//在 TypeScript 中，declare module "mockjs" 用于 声明一个模块，以便 TypeScript 可以正确解析 mockjs 这个库，而不会报 找不到模块 的错误。
declare module "mockjs"
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}
