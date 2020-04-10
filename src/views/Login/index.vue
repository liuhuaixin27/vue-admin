<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li :class="{ current: item.current }"
            v-for="item in menuTab"
            :key="item.id"
            @click="toggleMenu(item)">
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
                         class="block"
                         @click="getSms()"
                         :disabled="codeButton.status">{{ codeButton.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')"
                     class="login-btn block">{{ model === "login" ? "登录" : "注册" }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetSms, Register, Login } from '@/api/login'
import { reactive, ref, onMounted, isRef, toRefs } from '@vue/composition-api'
import { validateEmail, validatePass, validateVCode } from '@/utils/validate'

export default {
  name: 'login',
  // setup(props, context) {
  //   root: (...)  == this
  //   parent: (...)  == this.parent
  //   refs: (...)  == this.$refs
  //   attrs: (...)  == this.$attrs
  //   listeners: (...)  == this.$listeners
  //   emit: (...)  == this.$emit
  setup(props, { refs, root }) {
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (validateEmail(value)) {
        callback(new Error('用户名格式有误！'))
      } else {
        callback()
      }
    }

    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (validatePass(value)) {
        callback(new Error('请输入6-20位的英文和数字!'))
      } else {
        callback()
      }
    }

    let validatePasswords = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value != ruleForm.password) {
        callback(new Error('重复密码不正确!'))
      } else {
        callback()
      }
    }

    let validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (validateVCode(value)) {
        return callback(new Error('验证码格式有误！'))
      } else {
        callback()
      }
    }

    //声明登录、注册按钮
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' }
    ])

    //注册v-if判断条件
    const model = ref('login')

    //表单绑定数据
    const ruleForm = reactive({
      username: '',
      password: '',
      passwords: '',
      code: ''
    })

    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      passwords: [{ validator: validatePasswords, trigger: 'blur' }],
      code: [{ validator: validateCode, trigger: 'blur' }]
    })

    //声明函数点击切换注册和登录的背景
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false
      })
      data.current = true
      model.value = data.type
      //重置表单
      refs.ruleForm.resetFields()
      clearCodeButton()
    }

    //验证码按钮状态
    const codeButton = reactive({
      status: false,
      text: '获取验证码'
    })

    //获取验证码
    const getSms = () => {
      //判断邮箱是否为空
      if (ruleForm.username == '') {
        root.$message.error('邮箱不能为空！')
        return false
      }

      if (validateEmail(ruleForm.username)) {
        root.$message.error('邮箱格式错误！')
        return false
      }

      codeButton.status = true
      codeButton.text = '发送中'

      let data = {
        username: ruleForm.username,
        module: model.value
      }
      //发送验证码请求
      setTimeout(() => {
        GetSms(data)
          .then(response => {
            let data = response.data
            root.$message({
              message: data.message,
              type: 'success'
            })
            countDown(60)
            console.log(data)
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
    }

    //清除获取验证码按钮内容
    const clearCodeButton = () => {
      //还原验证码按钮默认状态
      codeButton.status = false
      codeButton.text = '获取验证码'
      //清除验证码按钮倒计时
      clearInterval(timer.value)
    }

    //倒计时
    const timer = ref(null)

    const countDown = number => {
      //判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value)
      }
      let time = number
      timer.value = setInterval(() => {
        time--
        if (time === 0) {
          clearInterval(timer.value)
          codeButton.status = false
          codeButton.text = '重新获取'
        } else {
          codeButton.text = `倒计时${time}秒`
        }
      }, 1000)
    }

    //提交表单
    const submitForm = formName => {
      //提交注册表单
      refs[formName].validate(valid => {
        if (valid) {
          model.value === 'login' ? login() : register()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    //提交登录表单
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code
      }
      Login(requestData)
        .then(response => {
          let data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          console.log(data)
        })
        .catch(error => {})
    }

    //提交注册表单
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code
      }
      Register(requestData)
        .then(response => {
          let data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          toggleMenu(menuTab[0])
          clearCodeButton()
        })
        .catch(error => {})
    }

    //挂载完成后
    onMounted(() => {})
    return {
      model,
      timer,
      codeButton,
      menuTab,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms,
      countDown,
      clearCodeButton,
      login,
      register
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
