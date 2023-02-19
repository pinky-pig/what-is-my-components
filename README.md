# Les Front-End Project

# 技术栈
- 🚓 [Vue3](https://cn.vuejs.org/guide/quick-start.html)
- 🚙 [Typescript](https://www.typescriptlang.org/zh/play#code/)
- 🛴 [Vite](https://vitejs.cn/)
- 🚌 [Tailwindcss](https://www.tailwindcss.cn/docs)
- 🚍 [Pinia](https://pinia.web3doc.top/)
- 🚠 [Vue-router](https://router.vuejs.org/)
- 🚂 [VueUse](https://vueuse.org/guide/)
- 🍦 [Element-plus](https://doc-archive.element-plus.org/#/zh-CN/)
- 🐱‍🚀 [Naive-UI](https://www.naiveui.com/zh-CN/os-theme)
- 🐱‍🏍 [Icon](https://icones.netlify.app/collection/carbon)
- 🍳 地图JS方面知识

## Git commit

- Chore : 杂活 -- 构建管理器配置等，代码无变动。  
- Feat : 新功能  
- Fix : Bug 修复  
- Style : 修改代码格式、补充分号等
- Docs : 文档修改，注释更改
- Refactor : 代码重构
- Test : 测试添加、测试重构等，代码无变动
- Revert : 恢复先前的提交

## 开发流程规范

### 文件名命名

遵循阿里前端开发规范
譬如：

- 项目命名 : 全部采用小写方式，以中线分隔。 `mall-management-system`  
- 目录命名 : 全部采用小写方式， 以中划线分隔，有复数结构时，要采用复数命名法， 缩写不用复数，使用 kebab-case 命名
    `head-search / page-loading / authorized / notice-icon`
- JS、CSS、SCSS、HTML、PNG 文件命名 : 全部采用小写方式， 以中划线分隔。 `render-dom.js /index.html / company-logo.png`

具体规范详见文件《 阿里前端开发规范.pdf 》

方法命名要保持规范，切忌英文拼音混杂，注释即代码，看名知意。


### 导入导出规范

涉及 node 端， 采用 CommonJS 规范。
业务开发不涉及 node 端，采用 ES Module 规范。

```ts
// CommonJS 

// ./utils/moduleA.ts
const name:string = "moduleA";
module.exports = { name } // 或者 `exports.name = name;`
// ./index.ts
const { name } = require("./foo.js");
console.log(name)  // moduleA

// ES Module
// ./utils/string.ts
export function createArr(defaultParams:string = 'Tom') {
  let allItems = Array.from(Array(100).keys(), (item,index) => {return {defaultParams,idx:item}});
  let fillArr = new Array(10).fill({defaultParams})
  return allItems
}
// ./index.ts
import { createArr } from './utils/string'
```

工具类文件夹及文件导出，默认 `index.ts` 文件导出本文件夹下所有的函数

```ts
// index.ts
export * from './common'
export * from './request'
```
`index.ts` 同级文件夹分功能模块采用 ES Module 导出
```ts
// ./common/index.ts
export * from './string'

// ./common/string.ts
export const pattern1 = /[?&]name=([^&]*)(&|$)/
```


### 组件开发

总之简单来说，组件内容较少，单文件组件。如果内容过长，Dom/JS分开，组合式API。Style 视组件内容复杂度，采用 `@apply`原子化 CSS及`CSS Module`。  

- Dom - 尽量使用 flex 、grid 布局  
  - [Icon](https://icones.netlify.app/collection/carbon) - 开源图标库
- CSS - TailwindCSS 、Less 、 CSS module   
- JS - 组合式

```html
<!-- icon -->
<div i-carbon-dicom-overlay />
```
```Less
// @apply 后面就是原子化 CSS。
.container {
  @apply w-full h-full;
  &:hover{
    transform:scale(1.2)
  }
}
```

```
// CSS Module 或者 scoped 
<style lang="less" module>
</style>
```
正常 simple 组件开发，照 vue 组件开发规范。
一般数量众多不可复制组件（譬如地图弹窗 Label）开发照如下规范：

```ts
import { Component } from "vue"
// CSS Module
import styles from "./index.module.less";

export function fightStationLabel(item?:stationItem) {
  let { props } = item ? item : {props:{label:'队站',value:'1车6人'}}
  return defineComponent({
    setup(props) { },
    render() {
      let dom =  
        <div class={styles.fightStationLabel}>
          <div class={styles.fightStationLabelLeft}>{props.label}</div>
          <div class={styles.fightStationLabelLeft}>{props.value}</div>
        </div>
      return dom
    },
  })
}

/** 其他队站 */
export function normalStationLabel(item?:stationItem) {
  let { props } = item ? item : {props:{label:'队站',value:'出警'}}
  return  defineComponent({
    setup() { },
    render() {
      let dom =  
        <div class={styles.normalStationLabel}>
          <div class={props.label ? styles.normalStationLabelLeft : ''} >{props.label}</div>
          <div class={props.value ? styles.normalStationLabelRight : ''} >{props.value}</div>
        </div>
      return dom
    },
  })
}
```

### JS 开发

通过文件夹命名含义， `index.ts` export 所有。可参考如下

目录如下：
- utils
  - index.ts
  - string.ts

```ts
// ./utils/index.ts
export * from './string.ts'

// ./utils/string.ts
export function fn(){
  return 'fn'
}

// 使用
import { fn } from '~/utils'
fn()
```

### 编辑器使用及代码规范
Vscode 编辑器设置及插件
配置详见 ` .vscode / extension.json ./settings.json`

### 目录结构及开发注意事项

- 代码缩进
  - 2 个空格 
  - 提交代码前注意检查代码缩进 (js & css), 避免提交缩进混乱的代码
- vue 组件命名: 使用 PascalCase 命名法 (组件文件名也遵循该规则), 比如 Foo.vue/FooBar.vue
- 组件默认通过接口从后台获取数据的函数，命名为 `fetchData()`，
    比如一个组件首先要列表获取数据，才进行后续增删改操作，这个列表获取数据的函数，命名为 `fetchData()`

- */.vscode* : vscode 配置
- */mock* : mock 数据
- */public* : Cesium 插件、接口配置 和 一些静态资源
- */.gitignore* : git 提交忽略项
- */auto-imports.d.ts* : vite-plugin-auto-import 插件生成
- */components.d.ts* : vite-plugin-components 插件生成
- */index.html* : 项目默认页面
- */src* : 源码
  - */src/assets* : 静态资源, 图片/字体 等
  - */src/components* : 通用组件
  - */src/hooks* : 一些 js 模块, 比如 logging, request 的封装。登录权限的封装
  - */src/router* : 路由配置
  - */src/service* : api层,不同的服务地址
  - */src/setup* : 安装相关 (比如第 3 方类库, 组件注册 等)
  - */src/store* : pinia 相关
  - */src/styles* : 公共样式
  - */src/typings* : ts 配置
  - */src/views* : 页面/视图
    - */src/views/login* : 登录页面
    - */src/views/home* : 主页
    - */src/views/error* : 404
- */vite.config.ts* : vite 配置
- */tsconfig.json* : typescript 配置
- */windi.config.js* : typescript 配置


