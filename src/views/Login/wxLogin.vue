<template>
    <div class="wxlogin">
        <div class="logo">
            <img src="@/assets/logo.png" alt="logo" />
        </div>
        <button @click="wxLogin" class="login-btn">微信登录</button>
    </div>
</template>

<script>
import wechatUtil from '@/utils/wechatUtil'
export default {
    name: 'WxLogin',
    data() {
        return {}
    },
    components: {},
    mounted() {},
    created() {
        wechatUtil.createdGetWechatUserByCode()
    },
    methods: {
        wxLogin() {
            wechatUtil.createdGetWechatUserByCode()
        },
    },
}
</script>

<style lang="scss" scoped>
.wxlogin {
    background: url('~@/assets/img/wx_loginbg.png') center center/ cover
        no-repeat;
    text-align: center;
    .logo {
        margin-top: 88px;
        margin-bottom: 120px;
        img {
            width: 78px !important;
            height: 78px !important;
        }
    }
    .login-btn {
        width: 315px;
        height: 48px;
        background: rgba(15, 37, 64, 1);
        border-radius: 100px;
        color: rgba(239, 206, 144, 1);
        font-weight: bold;
        font-size: 16px;
    }
}
</style>
