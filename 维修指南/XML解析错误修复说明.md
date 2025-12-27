# XML 解析错误修复说明

## 🔍 问题分析

### 错误信息
```
org.xml.sax.SAXParseException; lineNumber: 18; columnNumber: 26; 
元素内容必须由格式正确的字符数据或标记组成。
Failed to parse mapping resource: 'file [...\ScheduleMapper.xml]'
```

### 问题原因
1. **XML 特殊字符问题**
   - XML 中 `<`、`>`、`&` 等字符有特殊含义
   - 在 SQL 语句中使用 `>=` 和 `<=` 时，XML 解析器会误认为 `>` 是标签的开始
   - 导致 XML 解析失败

2. **具体位置**
   - `ScheduleMapper.xml` 第 18 行的 `work_date <= #{endDate}` 
   - 其中的 `<=` 符号触发了 XML 解析错误

---

## ✅ 修复方案

### 使用 CDATA 包裹 SQL 语句

**CDATA 的作用：**
- CDATA（Character Data）告诉 XML 解析器，这部分内容应该作为纯文本处理
- 不需要解析其中的 XML 标签和特殊字符
- 这是 MyBatis XML 映射文件中的最佳实践

### 修复内容

1. **ScheduleMapper.xml**
   - 使用 `<![CDATA[ ... ]]>` 包裹 SQL 语句
   - 解决了 `>=` 和 `<=` 的解析问题

2. **AppointmentMapper.xml**
   - 也添加了 CDATA 包裹
   - 保持代码风格一致，避免未来可能出现的问题

---

## 🚀 修复步骤

### 步骤 1：确认文件已修复

检查以下文件：
- ✅ `src/main/resources/mapper/ScheduleMapper.xml` - 已添加 CDATA
- ✅ `src/main/resources/mapper/AppointmentMapper.xml` - 已添加 CDATA

### 步骤 2：重新编译项目

```powershell
cd D:\ProgramFiles\CodeProjects\hospital-management-system\HospitalManagementSystem_backend
mvn clean compile
```

### 步骤 3：重启后端服务

**停止当前服务：**
- 如果使用 PowerShell：按 `Ctrl + C`
- 如果使用 IDEA：点击停止按钮

**重新启动：**
```powershell
mvn spring-boot:run
```

**等待看到：**
```
Started HospitalManagementApplication in X.XXX seconds
```

### 步骤 4：验证修复

1. **检查启动日志**
   - 应该不再出现 XML 解析错误
   - 应该看到 "Started" 消息

2. **测试功能**
   - 访问：http://localhost:5173
   - 登录：doctor1 / 123456
   - 测试预约和排班功能

---

## 📝 修复前后对比

### 修复前（错误）
```xml
<select id="selectSchedulesByDoctor" resultType="com.hospital.entity.Schedule">
    SELECT ...
    WHERE doctor_id = #{doctorId}
      AND work_date >= #{startDate}  <!-- 这里会报错 -->
      AND work_date <= #{endDate}    <!-- 这里会报错 -->
    ORDER BY ...
</select>
```

### 修复后（正确）
```xml
<select id="selectSchedulesByDoctor" resultType="com.hospital.entity.Schedule">
    <![CDATA[
    SELECT ...
    WHERE doctor_id = #{doctorId}
      AND work_date >= #{startDate}  <!-- 现在可以正常解析 -->
      AND work_date <= #{endDate}    <!-- 现在可以正常解析 -->
    ORDER BY ...
    ]]>
</select>
```

---

## 💡 最佳实践

### 在 MyBatis XML 映射文件中：

1. **使用 CDATA 包裹 SQL 语句**（推荐）
   - 可以避免 XML 特殊字符的问题
   - 代码更清晰，不需要转义

2. **或者使用 XML 转义字符**
   - `&lt;` 代表 `<`
   - `&gt;` 代表 `>`
   - `&amp;` 代表 `&`
   - 例如：`work_date &gt;= #{startDate}`

3. **推荐使用 CDATA**
   - 更清晰易读
   - 不需要记住转义字符
   - 是 MyBatis 官方推荐的做法

---

## ⚠️ 注意事项

1. **CDATA 的语法**
   - 开始：`<![CDATA[`
   - 结束：`]]>`
   - 注意：`]]>` 不能出现在 CDATA 内容中

2. **参数绑定仍然有效**
   - CDATA 不影响 MyBatis 的参数绑定
   - `#{parameter}` 仍然可以正常工作

3. **SQL 语句格式**
   - CDATA 内的 SQL 语句可以保持原有格式
   - 可以包含换行、空格等

---

## ✅ 修复完成检查清单

- [ ] 已修复 `ScheduleMapper.xml` - 添加 CDATA
- [ ] 已修复 `AppointmentMapper.xml` - 添加 CDATA
- [ ] 已重新编译项目
- [ ] 已重启后端服务
- [ ] 后端服务启动成功
- [ ] 不再出现 XML 解析错误
- [ ] 功能正常工作

---

## 🎉 完成

如果以上所有步骤都完成，并且后端服务正常启动，说明问题已修复！

**下一步：**
- 可以继续测试功能
- 可以继续部署微信小程序
- 可以开始使用系统进行开发

**祝你使用愉快！** 🚀

