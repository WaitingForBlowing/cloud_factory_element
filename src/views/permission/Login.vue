<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="title">
        <img src="@/assets/image/logo.png" alt="">
        <span class="title-text">Cloud Factory</span>
      </div>
      <div class="desc">
        <span>Cloud Factory,一个生活在未来不断前进的新概念云工厂</span>
      </div>
      <el-form class="login-form" :model="formData" :rules="formRules" ref="loginForm">
        <!--account-->
        <el-form-item prop="username">
          <el-input
              prefix-icon="iconfont icon-user"
              v-model="formData.username"
              placeholder="请输入账号"/>
        </el-form-item>
        <!--password-->
        <el-form-item prop="password">
          <el-input
              prefix-icon="iconfont icon-lock"
              v-model="formData.password"
              type="password"
              placeholder="请输入密码" show-password/>
        </el-form-item>
        <div class="link">
          <el-link class="forget-pwd" type="primary">忘记密码</el-link>
          <router-link to="/register">
            <el-link class="register" type="primary">注册</el-link>
          </router-link>
        </div>
        <el-form-item>
          <el-button class="login-button" type="primary" @click="submit('loginForm')">登录</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from '@/api/user'
import QS from 'qs'
import ls from "@/utils/lsUtil";

export default {
  name: "Login",
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      formRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {data, code, message} = await login(QS.stringify(this.formData))
          if (code !== 200) {
            // 登录失败逻辑
            this.$notify.error({
              title: '错误',
              message: message
            })
          } else {
            // 登录成功逻辑
            this.$notify.success({
              title: '成功',
              message: message,
            })
            this.$store.commit('SET_ROLE', data)
            ls.set_value('ROLE_ID', data.roleId)
            ls.set_value('USER_ID', data.id)
            ls.set_value('USER_ACCOUNT', data.account)
            // 跳转页面
            await this.$router.push('/home')
          }

        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.login-container {
  background-image: url("../../assets/image/background.png");
  background-color: #f0f2f5;
  height: 100%;
}

.login-container .login-panel {
  width: 370px;
  height: 470px;
  /*background-color: black;*/
  border-radius: 3px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-panel .title {
  height: 50px;
}

.login-panel .title img {
  max-height: 45px;
  float: left;
  margin-left: 40px;
}

.login-panel .title .title-text {
  display: inline-block;
  float: left;
  font-size: 33px;
  color: rgba(0, 0, 0, .85);
  line-height: 50px;
  font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 600;
  margin-left: 20px;
}

.login-panel .desc {
  display: block;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  margin-top: 12px;
  margin-bottom: 40px;
}

.login-panel .login-form {
  margin-top: 60px;
}

.login-panel .login-form input {
  border-radius: 0 !important;
}

.login-panel .login-form .link {
  height: 15px;
}

.login-panel .login-form .forget-pwd {
  float: right;
  font-size: 14px;
  right: 5px;
  text-decoration: none;
}

.login-panel .login-form .register {
  float: left;
  font-size: 14px;
  left: 5px;
  text-decoration: none;
}

.login-panel .login-form .login-button {
  margin-top: 25px;
  width: 100%;
  font-size: 16px;
}
</style>
