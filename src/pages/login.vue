<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div class="welcome-content">
                <div class="welcome-title">
                    <h2>欢迎使用</h2>
                    <h1>商城后台管理系统</h1>
                </div>
                <div class="welcome-description">
                    <p>高效、便捷的商城管理平台</p>
                    <p>轻松管理商品、订单、用户和数据</p>
                </div>
                <div class="welcome-icons">
                    <div class="icon-item">
                        <el-icon size="30"><Shop /></el-icon>
                        <span>商品管理</span>
                    </div>
                    <div class="icon-item">
                        <el-icon size="30"><Document /></el-icon>
                        <span>订单处理</span>
                    </div>
                    <div class="icon-item">
                        <el-icon size="30"><User /></el-icon>
                        <span>用户中心</span>
                    </div>
                    <div class="icon-item">
                        <el-icon size="30"><DataAnalysis /></el-icon>
                        <span>数据分析</span>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <div class="login-form-container">
                <h2 class="title">欢迎回来</h2>
                <div class="subtitle">
                    <span class="line"></span>
                    <span>账号密码登录</span>
                    <span class="line"></span>
                </div>
                <el-form ref="formRef" :rules="rules" :model="form" class="login-form">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" size="large">
                            <template #prefix>
                                <el-icon>
                                    <user />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password size="large">
                            <template #prefix>
                                <el-icon>
                                    <lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="rememberMe" class="remember-me">记住我</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button round color="#409EFF" class="login-button" type="primary" @click="onSubmit" :loading="loading" size="large">
                            登 录
                        </el-button>
                    </el-form-item>
                </el-form>
                
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { toast } from '~/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Shop, Document, User, DataAnalysis } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()

// do not use same name with ref
const form = reactive({
    username: "",
    password: ""
})

const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
        },
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        },
    ]
}

const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true

        store.dispatch("login", form).then(res => {
            toast("登录成功")
            router.push("/")
        }).finally(() => {
            loading.value = false
        })
    })
}



// 监听回车事件
function onKeyUp(e) {
    if (e.key == "Enter") onSubmit()
}

// 添加键盘监听
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})
// 移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

</script>

<style scoped>
.login-container {
    @apply min-h-screen;
    background-image: linear-gradient(120deg, #1863dd 0%, #c2e9fb 100%);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center;
}

.login-container .right {
    @apply bg-white bg-opacity-80 flex-col rounded-l-2xl shadow-2xl;
}

.welcome-content {
    text-align: center;
    color: white;
    padding: 2rem;
}

.welcome-title h1 {
    @apply text-5xl font-bold mb-4;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    animation: fadeInDown 1s ease;
}

.welcome-title h2 {
    @apply text-3xl font-semibold mb-8;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 1s ease;
}

.welcome-description {
    @apply text-xl mb-12;
    animation: fadeIn 1.5s ease;
}

.welcome-description p {
    margin: 0.5rem 0;
    opacity: 0.9;
}

.welcome-icons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    animation: fadeIn 2s ease;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.icon-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.3);
}

.icon-item span {
    font-weight: 500;
}

.login-form-container {
    width: 100%;
    max-width: 400px;
    padding: 3rem 2rem;
}

.right .title {
    @apply font-bold text-3xl text-gray-800 text-center mb-6;
}

.subtitle {
    @apply flex items-center justify-center my-5 text-gray-500 space-x-2;
}

.subtitle .line {
    @apply h-[1px] w-16 bg-gray-300;
}

.login-form {
    width: 100%;
    margin: 1.5rem 0;
}

:deep(.el-input__wrapper) {
    border-radius: 25px;
    padding: 10px 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

:deep(.el-input__inner) {
    padding-left: 10px;
}

.remember-me {
    color: #606266;
    font-weight: 500;
}

.login-button {
    width: 100%;
    height: 45px;
    font-size: 16px;
    letter-spacing: 2px;
    margin-top: 10px;
    box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
}



/* 动画效果 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .login-container .left {
        display: none;
    }
    
    .login-container .right {
        width: 100%;
        border-radius: 0;
    }
    
    .login-form-container {
        padding: 2rem 1.5rem;
    }
}
</style>