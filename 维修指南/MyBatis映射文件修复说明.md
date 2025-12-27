# MyBatis 映射文件缺失问题修复说明

## 🔍 问题分析

### 问题现象
当点击"刷新预约"等按钮时，后端报错：
```
org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): 
com.hospital.mapper.AppointmentMapper.selectTodayAppointmentsByDoctor

org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): 
com.hospital.mapper.ScheduleMapper.selectSchedulesByDoctor
```

### 问题原因
1. **Mapper 接口定义了方法，但缺少对应的 XML 映射文件**
   - `AppointmentMapper` 接口中定义了 `selectTodayAppointmentsByDoctor` 和 `selectPatientAppointments` 方法
   - `ScheduleMapper` 接口中定义了 `selectSchedulesByDoctor` 方法
   - 但 `src/main/resources/mapper/` 目录下没有对应的 XML 文件

2. **MyBatis 配置要求**
   - `application.yml` 中配置了：`mapper-locations: classpath:mapper/*.xml`
   - 这意味着 MyBatis 会在 `resources/mapper/` 目录下查找 XML 映射文件
   - 如果没有找到对应的 XML 文件，就会抛出 `BindingException`

---

## ✅ 修复内容

### 1. 创建 AppointmentMapper.xml

**文件位置：** `src/main/resources/mapper/AppointmentMapper.xml`

**包含的 SQL 映射：**
- `selectPatientAppointments`：查询患者预约列表
- `selectTodayAppointmentsByDoctor`：查询医生今日预约

### 2. 创建 ScheduleMapper.xml

**文件位置：** `src/main/resources/mapper/ScheduleMapper.xml`

**包含的 SQL 映射：**
- `selectSchedulesByDoctor`：查询医生排班

### 3. 优化代码

- 修改了 `AppointmentMapper.java` 接口，移除了 `selectTodayAppointmentsByDoctor` 方法中不需要的 `today` 参数
- 修改了 `AppointmentServiceImpl.java`，简化了 `listTodayAppointments` 方法的实现
- SQL 查询中使用 `CURDATE()` 来获取今天的日期，更加可靠

---

## 🚀 修复步骤

### 步骤 1：确认文件已创建

检查以下文件是否存在：
- ✅ `src/main/resources/mapper/AppointmentMapper.xml`
- ✅ `src/main/resources/mapper/ScheduleMapper.xml`

### 步骤 2：重新编译项目

**使用 Maven 命令：**
```powershell
cd D:\ProgramFiles\CodeProjects\hospital-management-system\HospitalManagementSystem_backend
mvn clean compile
```

**或使用 IDEA：**
1. 右键项目 → `Maven` → `Reload Project`
2. 等待编译完成

### 步骤 3：重启后端服务

**⚠️ 重要：必须重启后端服务才能加载新的 XML 映射文件**

**停止当前服务：**
- 如果使用 PowerShell：按 `Ctrl + C`
- 如果使用 IDEA：点击停止按钮

**重新启动：**
```powershell
cd D:\ProgramFiles\CodeProjects\hospital-management-system\HospitalManagementSystem_backend
mvn spring-boot:run
```

**等待看到：**
```
Started HospitalManagementApplication in X.XXX seconds
```

### 步骤 4：测试功能

1. **访问 Web 管理端**
   - 打开：http://localhost:5173
   - 登录：doctor1 / 123456

2. **测试功能**
   - 点击"刷新预约"按钮
   - 查看排班管理
   - 查看预约管理

3. **预期结果**
   - ✅ 不再出现 `BindingException` 错误
   - ✅ 可以正常查询今日预约
   - ✅ 可以正常查询排班信息
   - ✅ 可以正常查询患者预约列表

---

## 📝 修改的文件清单

### 新增文件
1. **AppointmentMapper.xml**
   - 位置：`src/main/resources/mapper/AppointmentMapper.xml`
   - 功能：定义预约相关的 SQL 查询

2. **ScheduleMapper.xml**
   - 位置：`src/main/resources/mapper/ScheduleMapper.xml`
   - 功能：定义排班相关的 SQL 查询

### 修改文件
1. **AppointmentMapper.java**
   - 移除了 `selectTodayAppointmentsByDoctor` 方法中不需要的 `today` 参数

2. **AppointmentServiceImpl.java**
   - 简化了 `listTodayAppointments` 方法的实现

---

## 🔍 SQL 查询说明

### 1. selectTodayAppointmentsByDoctor

**功能：** 查询医生今日预约

**SQL 逻辑：**
- 查询指定医生的预约
- 预约时间为今天（使用 `CURDATE()`）
- 状态为待就诊（0）或已就诊（1）
- 按预约时间和时间段排序

### 2. selectPatientAppointments

**功能：** 查询患者预约列表

**SQL 逻辑：**
- 查询指定患者的预约
- 按预约时间倒序排序（最新的在前）

### 3. selectSchedulesByDoctor

**功能：** 查询医生排班

**SQL 逻辑：**
- 查询指定医生的排班
- 日期范围在 `startDate` 和 `endDate` 之间
- 按工作日和时间段排序

---

## ⚠️ 注意事项

1. **必须重启后端服务**
   - XML 映射文件在服务启动时加载
   - 修改后必须重启才能生效

2. **文件路径必须正确**
   - XML 文件必须放在 `src/main/resources/mapper/` 目录下
   - 文件名必须与 Mapper 接口名一致（如 `AppointmentMapper.xml` 对应 `AppointmentMapper.java`）

3. **命名空间必须匹配**
   - XML 文件中的 `namespace` 必须与 Mapper 接口的完整类名一致
   - 例如：`com.hospital.mapper.AppointmentMapper`

4. **方法名必须一致**
   - XML 中的 `id` 必须与 Mapper 接口中的方法名一致
   - 例如：`selectTodayAppointmentsByDoctor` 对应接口中的 `selectTodayAppointmentsByDoctor` 方法

---

## 🎯 验证修复是否成功

### 方法一：通过浏览器测试

1. 访问：http://localhost:5173
2. 登录：doctor1 / 123456
3. 点击"刷新预约"按钮
4. 查看是否还有错误

### 方法二：通过后端日志查看

启动后端后，尝试刷新预约，查看后端日志：

**修复前（错误）：**
```
ERROR: Invalid bound statement (not found): com.hospital.mapper.AppointmentMapper.selectTodayAppointmentsByDoctor
```

**修复后（正常）：**
```
==>  Preparing: SELECT ... FROM appointments WHERE doctor_id = ? AND DATE(appointment_time) = CURDATE() ...
==> Parameters: 1(Long)
<==    Total: X
```

### 方法三：使用 Postman 测试

**测试今日预约：**
```
GET http://localhost:8080/api/appointments/doctor/1/today
```

**预期响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [...]
}
```

**测试排班：**
```
GET http://localhost:8080/api/schedules/doctor/1?startDate=2025-11-09&endDate=2025-11-23
```

**预期响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [...]
}
```

---

## ❓ 常见问题

### Q1: 重启后还是报错？

**可能原因：**
1. XML 文件路径不正确
2. 命名空间不匹配
3. 方法名不匹配
4. 编译失败，新文件未包含在 classpath 中

**解决方法：**
1. 检查文件路径：`src/main/resources/mapper/AppointmentMapper.xml`
2. 检查命名空间：`com.hospital.mapper.AppointmentMapper`
3. 检查方法名：`selectTodayAppointmentsByDoctor`
4. 重新编译：`mvn clean compile`

### Q2: XML 文件语法错误？

**检查：**
1. XML 文件格式是否正确
2. SQL 语句是否正确
3. 参数绑定是否正确（使用 `#{}` 而不是 `${}`）

### Q3: 查询结果为空？

**可能原因：**
1. 数据库中没有数据
2. SQL 查询条件不正确
3. 日期格式问题

**解决方法：**
1. 检查数据库中是否有测试数据
2. 检查 SQL 查询条件
3. 使用数据库客户端工具直接执行 SQL 测试

---

## ✅ 修复完成检查清单

- [ ] 已创建 `AppointmentMapper.xml` 文件
- [ ] 已创建 `ScheduleMapper.xml` 文件
- [ ] 已修改 `AppointmentMapper.java` 接口
- [ ] 已修改 `AppointmentServiceImpl.java` 实现
- [ ] 已重新编译项目
- [ ] 已重启后端服务
- [ ] 可以正常查询今日预约
- [ ] 可以正常查询排班信息
- [ ] 不再出现 `BindingException` 错误

---

## 🎉 完成

如果以上所有步骤都完成，并且功能正常工作，说明问题已修复！

**下一步：**
- 可以继续测试其他功能
- 可以继续部署微信小程序
- 可以开始使用系统进行开发

**祝你使用愉快！** 🚀

