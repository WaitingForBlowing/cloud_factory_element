<template>
  <div class="register-container">
    <div class="register-panel">
      <div class="title">
        <img src="@/assets/image/logo.png" alt="">
        <span class="title-text">Cloud Factory</span>
      </div>
      <div class="desc">
        <span>Cloud Factory,一个生活在未来不断前进的新概念云工厂</span>
      </div>
      <h3 class="register-title"><span>注册</span></h3>
      <el-form class="register-form" :model="formData" :rules="formRules" ref="registerForm">
        <el-form-item prop="account">
          <el-input v-model="formData.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="formData.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="tel">
          <el-input v-model="formData.tel" placeholder="请输入电话号码" type="tel"></el-input>
        </el-form-item>
        <el-form-item prop="mail">
          <el-input v-model="formData.mail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.type" placeholder="请选择您注册的用户类型" @change="typeChange">
            <el-option label="云工厂管理员" value="0"></el-option>
            <el-option label="经销商" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="consignee" v-if="account_type === '0'">
          <el-form-item prop="factoryName">
            <el-input v-model="formData.factoryName" placeholder="请输入工厂名称"/>
          </el-form-item>
          <el-form-item prop="factoryDesc">
            <el-input v-model="formData.factoryDesc" placeholder="请输入工厂简介" type="textarea"/>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="register-button" type="primary" @click="submit('registerForm')">注册</el-button>
          <router-link to="/login">
            <el-link class="register-link" type="primary">使用已有账户登录</el-link>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {register} from "@/api/user";
import QS from "qs";

export default {
  name: "Register",
  data() {
    return {
      formData: {
        account: '',
        password: '',
        name: '',
        tel: '',
        mail: '',
        type: '',
        address: '',
        factoryName: '',
        factoryDesc: ''
      },
      formRules: {
        account: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
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
        ],
        name: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            type: 'email',
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ]
      },
      account_type: 0,
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { code, message } = await register(QS.stringify(this.formData))
          if (code !== 200) {
            // 注册失败逻辑
            this.$notify.error({
              title: '错误',
              message: message
            })
          } else {
            // 注册成功逻辑
            this.$notify.success({
              title: '成功',
              message: message,
            })
          }
          // 跳转页面
          await this.$router.push('/login')
        } else {
          return false
        }
      })
    },

    typeChange(checkData) {
      this.account_type = checkData
    }
  }
}
</script>

<style scoped>
.register-container {
  background-image: url("../../assets/image/background.png");
  background-color: #f0f2f5;
  height: 100%;
}

.register-container .register-panel {
  width: 370px;
  height: 470px;
  /*background-color: black;*/
  border-radius: 3px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.register-container .register-panel .register-title {
  font-size: 16px;
  font-weight: 500;
}

.register-panel .title {
  height: 50px;
}

.register-panel .title img {
  max-height: 45px;
  float: left;
  margin-left: 40px;
}

.register-panel .title .title-text {
  display: inline-block;
  float: left;
  font-size: 33px;
  color: rgba(0, 0, 0, .85);
  line-height: 50px;
  font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 600;
  margin-left: 20px;
}

.register-panel .desc {
  display: block;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  margin-top: 12px;
  margin-bottom: 40px;
}

.register-panel .register-form {
  margin-top: 30px;
}

.register-panel .login-form input {
  border-radius: 0 !important;
}

.register-panel .register-form .register-button {
  width: 50%;
  font-size: 16px;
  float: left;
}
.register-panel .register-form .register-link,
.register-panel .register-form .register-link:hover{
  float: right;
  height: 42px;
  line-height: 42px;
}
</style>
