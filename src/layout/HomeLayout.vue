<template>
  <el-container class="container">
    <el-aside class="aside" :width=" isCollapse ? '64px' : '256px'">
      <div class="logo">
        <img src="@/assets/image/logo.png" alt="">
        <h1 v-if="!isCollapse">Cloud Factory</h1>
      </div>
      <el-menu
          class="menu"
          background-color="#001529"
          text-color="#ffffffa6"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
      >
        <el-submenu class="submenu" :index="item.id.toString()" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="icons[item.id]"></i>
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
              :index="subItem.url"
              v-for="subItem in item.children"
              :key="subItem.id">
            <template slot="title">
              <span>{{ subItem.name }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container class="right">
      <el-header class="header">
        <span :class="['in-out', 'iconfont', isCollapse ? 'icon-indent' : 'icon-outdent']" @click="toggleCollapse"></span>
        <el-button class="logout" type="primary" @click="logout">退出登录</el-button>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getMenuList} from '@/api/menu'
import {logout} from "@/api/user";
import ls from "@/utils/lsUtil";
import {ACCESS_TOKEN} from "@/store/mutation-types";

export default {
  name: "HomeLayout",
  data() {
    return {
      menuList: [],
      icons: {
        '1': 'iconfont icon-setting',
        '2': 'iconfont icon-accountbook',
        '3': 'iconfont icon-cluster',
        '7': 'iconfont icon-radarchart',
        '13': 'iconfont icon-Report',
        '11': 'iconfont icon-radarchart',
        '18': 'iconfont icon-Report',
        '19': 'iconfont icon-Report'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    async getMenu() {
      let id = this.$store.getters.role_id
      if (!id) {
        id = ls.get_value('ROLE_ID')
      }
      const { data, code } = await getMenuList(id)
      if (code !== 200) {
        this.$notify.error({
          title: '错误',
          message: data.message
        })
      } else {
        console.log(data)
        this.menuList = data
      }
    },
    async logout() {
      const { code } = await logout()
      if (code !== 200) {
        this.$notify.error({
          title: '错误',
          message: '登出失败'
        })
      } else {
        this.$store.commit('SET_TOKEN', '')
        ls.remove(ACCESS_TOKEN)
        this.$notify.success({
          title: '成功',
          message: '退出登录'
        })

        await this.$router.push('/login')
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.container .aside {
  background-color: #001529;
  height: 100%;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35)
}

.container .aside .sub-menu {
  padding-left: 24px;
}

.container .right .header {
  background-color: #fff;
  height: 64px!important;
  line-height: 64px;
  box-shadow: 0 1px 4px #00152914;
}

.container .right .main {
  background-color: #f0f2f5;
}

.container .aside .logo {
  height: 64px;
  line-height: 64px;
  margin-left: 15px;
}

.container .aside .logo img {
  display: inline-block;
  width: 32px;
  height: 32px;
  vertical-align: middle;
}

.container .aside .logo h1 {
  display: inline-block;
  margin-left: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  vertical-align: middle;
  font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

.iconfont {
  margin-right: 10px;
}

.container .right .header .in-out {
  display: inline-block;
  height: 64px;
  line-height: 64px;
  vertical-align: top;
  cursor: pointer;
  font-size: 24px;
}

.container .right .header .logout {
  float: right;
  margin-top: 10px;
}

.sub-menu:hover i {
  color: #fff;
}
</style>
