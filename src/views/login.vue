<script setup lang="ts">
import logo from '@/assets/logo.png'
import { reactive, ref } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import { useUserStore } from '@/store/auth'
import { useRouter } from 'vue-router'

interface RuleForm {
    username: string,
    password: string
}
const ruleForm: RuleForm = reactive({
    username: '',
    password: ''
})

const rules = reactive<FormRules<RuleForm>>({
    username: [{
        required: true, message: '用户名不能为空', trigger: 'blur'
    },
    {
        min: 4, max: 8, message: '用户名要求4-8位数字字母组合', trigger: 'blur'

    }],
    password: [{
        required: true, message: '密码不能为空', trigger: 'blur'
    }]
})

//ref获取dom元素
//参考vue官网 ref通过泛型传递数据类型  reactive则是通过接口传递数据类型
const formRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()

const handleLogin = () => {
    //?.可选链 
    formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            //如果在这里直接写router.push（），并没有对登录成功与否进行判断。valid只是在验证输入的密码位数，真正判断是否成功的是login函数，在auth.ts里。而编程式导航router只能在组件里使用（即vue结尾的文件），在auth.ts里得不到router对象，因此直接把router当成参数传过去，这样在auth.ts里也能使用（第一种方法）
            // userStore.login(ruleForm, router)

            //第二种是使用导航守卫的方法（更推荐）
            await userStore.login(ruleForm)
            router.push('/')


        }
    })
}
//?.可选链操作符 在formRef.value不为空的时候才会调用方法， 为空的时候会返回undefined 而不是报错

</script>

<template>
    <div class="bg">
        <div class="login">
            <div class="logo">
                <img :src="logo" alt="" width="70px" height="70px">
                <h1 class="ml"> 动力港能源管理平台 </h1>
            </div>
            <el-form :model="ruleForm" label="用户名" :rules="rules" ref="formRef">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="Lock" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%;" @click="handleLogin()">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped lang="less">
.bg {
    background-image: url('@/assets/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    // vh 是 视口高度（viewport height） 的单位。
    height: 100vh;

    .login {
        width: 500px;
        height: 300px;
        padding: 50px;
        box-shadow: 0 0 10px 10px #f4f4f4;
        position: absolute;
        // 将元素的左上角移动到父容器的 50% 高度 & 50% 宽度 位置。
        top: 50%;
        left: 30%;
        // 元素自身向 左上角移动 自身宽度 & 高度的 50%
        transform: translate(-50%, -50%);

        .logo {
            display: flex;
            justify-content: center;
            align-items: center;

            h1 {
                color: rgb(14, 53, 148);
            }
        }
    }
}
</style>
