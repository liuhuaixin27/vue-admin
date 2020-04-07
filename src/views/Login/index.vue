<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li :class="{ current: item.current }"
            v-for="item in menuTab"
            :key="item.id"
            @click="toggleMneu(item)">
          {{ item.txt }}
        </li>
      </ul>
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               class="demo-ruleForm login-form"
               size="medium">
        <el-form-item prop="username">
          <label for="">邮箱</label>
          <el-input type="text"
                    v-model="ruleForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label for="">密码</label>
          <el-input type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"
                    minlength="6"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="passwords"
                      v-if="model === 'register'">
          <label for="">确认密码</label>
          <el-input type="password"
                    v-model="ruleForm.passwords"
                    autocomplete="off"
                    minlength="6"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <label for="">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="text"
                        v-model="ruleForm.code"
                        autocomplete="off"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success"
                         class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')"
                     class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePass, validateVCode } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (validateEmail(value)) {
        callback(new Error('用户名格式有误！'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (validatePass(value)) {
        callback(new Error('请输入6-20位的英文和数字!'))
      } else {
        callback()
      }
    }
    var validatePasswords = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value != this.ruleForm.password) {
        callback(new Error('重复密码不正确!'))
      } else {
        callback()
      }
    }
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (validateVCode(value)) {
        return callback(new Error('验证码格式有误！'))
      } else {
        callback()
      }
    }
    return {
      menuTab: [
        { txt: '登录', current: true, type: 'login' },
        { txt: '注册', current: false, type: 'register' }
      ],
      model: '',
      ruleForm: {
        username: '',
        password: '',
        passwords: '',
        code: ''
      },
      rules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        passwords: [{ validator: validatePasswords, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    toggleMneu(data) {
      this.menuTab.forEach(elem => {
        elem.current = false
      })
      data.current = true
      this.model = data.type
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    color: #ffffff;
    margin-bottom: 3px;
    font-size: 14px;
    margin-top: 13px;
  }
  .login-btn {
    margin-top: 35px;
  }
  .block {
    width: 100%;
    height: 36px;
    display: block;
  }
}
</style>
