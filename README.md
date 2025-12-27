# 医院管理系统

一个完整的医院管理系统，包含患者微信小程序、医生Web管理端和SpringBoot后端API。

## 项目结构

```
hospital-management-system/
├── HospitalManagementSystem_backend/  # SpringBoot3 后端API
├── hms_miniprogram/                   # 微信小程序（患者端）
├── web-admin/                         # Vue3 Web管理端（医生端）
└── hms_database/                      # 数据库脚本（init.sql 等）
```

## 环境要求

- JDK 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+
- 微信开发者工具

## 快速开始

### 1. 数据库初始化

```bash
# 连接 MySQL，执行 hms_database 目录下的 SQL 脚本
mysql -u root -p < hms_database/init.sql
```

### 2. 启动后端服务

```bash
cd HospitalManagementSystem_backend
mvn clean install
mvn spring-boot:run
```

后端服务默认运行在：http://localhost:8080

### 3. 启动Vue管理端

```bash
cd web-admin
npm install
npm run dev
```

管理端默认运行在：http://localhost:5173

### 4. 运行微信小程序

1. 打开微信开发者工具
2. 导入项目：选择 `hms_miniprogram` 目录
3. 配置AppID（测试可使用测试号）
4. 确保后端API地址配置正确

## 项目说明

### 后端技术栈
- SpringBoot 3.1+
- MyBatis-Plus
- Druid连接池
- Lombok
- Jackson

### 前端技术栈（Web管理端）
- Vue 3
- Vite
- Element Plus
- Vue Router 4
- Pinia
- Axios

### 小程序技术栈
- 微信小程序原生框架
- ES6+语法

## API文档

后端API统一前缀：`/api`

### 主要接口
- 患者相关：`/api/patients/**`
- 医生相关：`/api/doctors/**`
- 预约相关：`/api/appointments/**`
- 排班相关：`/api/schedules/**`

## 注意事项

1. 数据库配置需要根据实际情况修改 `HospitalManagementSystem_backend/src/main/resources/application.yml`
2. 小程序中的 API 地址需要配置到实际的后端地址
3. 微信支付等功能需要配置真实的小程序AppID和密钥

## 开发团队

学生开发项目

## 项目结构说明

### 后端 (HospitalManagementSystem_backend)
- `src/main/java/com/hospital/` - Java源代码
  - `entity/` - 实体类
  - `mapper/` - MyBatis Mapper接口
  - `service/` - 业务逻辑层
  - `controller/` - REST API控制器
  - `config/` - 配置类
  - `common/` - 公共类（统一响应、异常处理）
- `src/main/resources/` - 配置文件
  - `application.yml` - SpringBoot配置

### 小程序 (hms_miniprogram)
- `pages/` - 页面目录（19个界面）
- `assets/` - 静态资源目录
  - `icons/` - 图标
  - `hospitalInformation/` - 医院信息相关图片
  - `internetHospital/` - 互联网医院功能图片
  - `hospitalCard/` - 医院卡片图片
- `app.js` - 小程序入口
- `app.json` - 小程序配置

### Web管理端 (web-admin)
- `src/` - 源代码
  - `views/` - 页面组件
  - `layouts/` - 布局组件
  - `router/` - 路由配置
  - `stores/` - Pinia状态管理
  - `api/` - API封装
  - `styles/` - 样式文件

## 注意事项

1. **数据库配置**: 修改 `HospitalManagementSystem_backend/src/main/resources/application.yml` 中的数据库连接信息
2. **API 地址配置**: 
   - 小程序: 修改 `hms_miniprogram/app.js` 中的 `baseUrl`
   - Web 管理端: 修改 `web-admin/vite.config.js` 中的 proxy 配置
3. **小程序AppID**: 在微信开发者工具中配置你的小程序AppID
4. **图片资源**: 需要自行添加图片资源到 `hms_miniprogram/assets/` 目录下
5. **测试账号**: 
   - 医生端: doctor1-doctor10, 密码: 123456
   - 患者端: 通过小程序添加就诊人

## 功能清单

### 小程序端（患者）
- ✅ 首页（搜索、就诊人轮播、功能模块）
- ✅ 科室选择
- ✅ 医生列表和详情
- ✅ 预约挂号
- ✅ 我的预约
- ✅ 就诊人管理
- ✅ 缴费记录
- ✅ 病历查询
- ✅ 消息通知
- ✅ 医院信息、服务指南
- ✅ 地图导航

### Web管理端（医生）
- ✅ 医生登录
- ✅ 工作台（数据概览、今日预约）
- ✅ 预约管理
- ✅ 患者管理
- ✅ 排班管理
- ✅ 病历管理

### 后端API
- ✅ 患者注册和管理
- ✅ 医生查询和管理
- ✅ 预约创建和管理
- ✅ 排班查询
- ✅ 病历管理
- ✅ 统一响应格式
- ✅ 全局异常处理
- ✅ 跨域配置

**已完成医院管理系统开发。总结如下：**
项目完成情况及已完成的功能:

1. 后端 (SpringBoot3)
✅ 数据库设计和 SQL 脚本（7 张表，含测试数据）
✅ 实体类、Mapper、Service 层
✅ RESTful API（患者、医生、预约、排班、病历）
✅ 统一响应格式和全局异常处理
✅ 跨域配置
✅ MyBatis-Plus 配置
2. 微信小程序（患者端）
已完成 19 个界面：
✅ 首页（搜索、就诊人轮播、功能模块）
✅ 科室选择
✅ 医生列表和详情（超声科/病理科）
✅ 预约挂号
✅ 我的预约
✅ 就诊人管理（添加、编辑、删除）
✅ 缴费记录
✅ 病历查询
✅ 消息通知
✅ 医院信息、服务指南
✅ 地图导航
✅ 我的（功能入口）
3. Vue3 Web 管理端（医生端）
✅ 登录页面
✅ 工作台（数据概览、今日预约）
✅ 预约管理
✅ 患者管理
✅ 排班管理
✅ 病历管理
✅ 路由和状态管理
✅ API 封装

**项目特点**
完整的前后端分离架构
统一的代码风格和规范
详细的注释和文档
图片资源位置标注
青绿色主题设计（小程序）

**使用说明**
数据库：执行 database/init.sql
后端：进入 HospitalManagementSystem_backend 目录，修改 application.yml 中的数据库配置，运行 mvn spring-boot:run
小程序：在微信开发者工具中导入 hms_miniprogram 目录
Web 管理端：进入 web-admin 目录，运行 npm install && npm run dev

**测试账号**
医生端：doctor1-doctor10，密码：123456
患者端：通过小程序输入信息添加就诊人

**注意事项**
图片资源：需要将图片放入 hms_miniprogram/assets/ 目录（已标注位置）
API 地址：需要根据实际部署环境修改
小程序 AppID：在微信开发者工具中配置
