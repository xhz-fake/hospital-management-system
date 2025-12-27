-- 医院管理系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS hospital_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hospital_management;

-- 1. 科室表
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '科室ID',
    name VARCHAR(50) NOT NULL COMMENT '科室名称',
    description TEXT COMMENT '科室描述',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科室表';

-- 2. 医生表
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '医生ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    department_id BIGINT NOT NULL COMMENT '科室ID',
    title VARCHAR(50) NOT NULL COMMENT '职称（主任医师/副主任医师/主治医师/医师）',
    introduction TEXT COMMENT '简介',
    expertise TEXT COMMENT '擅长',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    status TINYINT DEFAULT 1 COMMENT '状态（0-不可咨询，1-可咨询）',
    username VARCHAR(50) UNIQUE COMMENT '登录用户名',
    password VARCHAR(255) COMMENT '登录密码（加密存储）',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_department (department_id),
    INDEX idx_status (status),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生表';

-- 3. 患者表
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '患者ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    phone VARCHAR(20) NOT NULL COMMENT '手机号',
    id_card VARCHAR(18) NOT NULL UNIQUE COMMENT '身份证号',
    gender TINYINT COMMENT '性别（0-女，1-男）',
    age INT COMMENT '年龄',
    residence VARCHAR(100) COMMENT '居住地',
    address VARCHAR(255) COMMENT '详细地址',
    birth_date DATE COMMENT '出生日期',
    openid VARCHAR(100) COMMENT '微信openid',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_id_card (id_card),
    INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='患者表';

-- 4. 排班表
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '排班ID',
    doctor_id BIGINT NOT NULL COMMENT '医生ID',
    work_date DATE NOT NULL COMMENT '工作日',
    time_slot VARCHAR(20) NOT NULL COMMENT '时间段（8-9,9-10,10-11,11-12,14-15,15-16,16-17,17-18）',
    available_count INT DEFAULT 1 COMMENT '可预约数量',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_doctor_date_time (doctor_id, work_date, time_slot),
    INDEX idx_doctor_date (doctor_id, work_date),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排班表';

-- 5. 预约表
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '预约ID',
    patient_id BIGINT NOT NULL COMMENT '患者ID',
    doctor_id BIGINT NOT NULL COMMENT '医生ID',
    appointment_time DATETIME NOT NULL COMMENT '预约时间',
    time_slot VARCHAR(20) NOT NULL COMMENT '时间段',
    status TINYINT DEFAULT 0 COMMENT '状态（0-待就诊，1-已就诊，2-个人取消，3-医生取消）',
    symptom_description TEXT COMMENT '症状描述',
    fee DECIMAL(10,2) DEFAULT 91.00 COMMENT '挂号费用',
    order_number VARCHAR(50) UNIQUE COMMENT '挂号单号',
    department_location VARCHAR(100) COMMENT '科室位置',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_appointment_time (appointment_time),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- 6. 病历表
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '病历ID',
    patient_id BIGINT NOT NULL COMMENT '患者ID',
    doctor_id BIGINT NOT NULL COMMENT '医生ID',
    appointment_id BIGINT COMMENT '预约ID',
    diagnosis TEXT COMMENT '诊断结果',
    treatment TEXT COMMENT '治疗方案',
    prescription TEXT COMMENT '处方',
    record_content TEXT COMMENT '病历内容',
    file_url VARCHAR(255) COMMENT '病历文件URL',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_appointment (appointment_id),
    INDEX idx_created_time (created_time),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='病历表';

-- 7. 消息通知表
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    patient_id BIGINT NOT NULL COMMENT '患者ID',
    type VARCHAR(50) NOT NULL COMMENT '消息类型（预约成功/取消预约/建档成功）',
    title VARCHAR(100) NOT NULL COMMENT '消息标题',
    content TEXT COMMENT '消息内容',
    appointment_id BIGINT COMMENT '关联预约ID',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读（0-未读，1-已读）',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_patient (patient_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知表';

-- 插入测试数据

-- 插入科室
INSERT INTO departments (name, description) VALUES
('超声科', '提供超声检查服务，包括腹部超声、心脏超声、妇科超声等'),
('病理科', '提供病理诊断服务，包括组织病理、细胞病理等');

-- 插入医生（密码为123456的MD5，实际项目中应使用BCrypt加密）
INSERT INTO doctors (name, department_id, title, introduction, expertise, avatar_url, status, username, password) VALUES
('张医生', 1, '主任医师', '从事超声诊断工作20余年，经验丰富，擅长各类超声检查', '腹部超声、心脏超声、妇科超声', '/assets/doctors/doctor1.jpg', 1, 'doctor1', 'e10adc3949ba59abbe56e057f20f883e'),
('李医生', 1, '副主任医师', '超声科副主任，专长于心血管超声诊断', '心脏超声、血管超声', '/assets/doctors/doctor2.jpg', 1, 'doctor2', 'e10adc3949ba59abbe56e057f20f883e'),
('王医生', 1, '主治医师', '擅长妇科和产前超声诊断', '妇科超声、产前超声', '/assets/doctors/doctor3.jpg', 1, 'doctor3', 'e10adc3949ba59abbe56e057f20f883e'),
('赵医生', 1, '医师', '超声科住院医师，工作认真负责', '基础超声检查', '/assets/doctors/doctor4.jpg', 1, 'doctor4', 'e10adc3949ba59abbe56e057f20f883e'),
('刘医生', 1, '主治医师', '从事超声工作10年，经验丰富', '腹部超声、浅表器官超声', '/assets/doctors/doctor5.jpg', 1, 'doctor5', 'e10adc3949ba59abbe56e057f20f883e'),
('陈医生', 2, '主任医师', '病理科主任，从事病理诊断30年', '肿瘤病理、消化病理', '/assets/doctors/doctor6.jpg', 1, 'doctor6', 'e10adc3949ba59abbe56e057f20f883e'),
('周医生', 2, '副主任医师', '病理科副主任，专长于妇科病理', '妇科病理、细胞病理', '/assets/doctors/doctor7.jpg', 1, 'doctor7', 'e10adc3949ba59abbe56e057f20f883e'),
('吴医生', 2, '主治医师', '病理科主治医师，工作认真', '常规病理、免疫组化', '/assets/doctors/doctor8.jpg', 1, 'doctor8', 'e10adc3949ba59abbe56e057f20f883e'),
('郑医生', 2, '医师', '病理科住院医师', '基础病理诊断', '/assets/doctors/doctor9.jpg', 1, 'doctor9', 'e10adc3949ba59abbe56e057f20f883e'),
('孙医生', 2, '主治医师', '病理诊断经验丰富', '肿瘤病理、术中快速病理', '/assets/doctors/doctor10.jpg', 1, 'doctor10', 'e10adc3949ba59abbe56e057f20f883e');

-- 插入测试患者
INSERT INTO patients (name, phone, id_card, gender, age, residence, address, birth_date) VALUES
('张三', '13800138001', '110101199001011234', 1, 34, '北京市', '北京市朝阳区某某街道', '1990-01-01'),
('李四', '13800138002', '110101199002021234', 0, 32, '北京市', '北京市海淀区某某街道', '1992-02-02'),
('王五', '13800138003', '110101199003031234', 1, 28, '北京市', '北京市丰台区某某街道', '1996-03-03');

-- 插入排班数据（未来14天）
INSERT INTO schedules (doctor_id, work_date, time_slot, available_count)
SELECT 
    d.id,
    DATE_ADD(CURDATE(), INTERVAL n.day_offset DAY) as work_date,
    t.time_slot,
    CASE WHEN d.id <= 5 THEN 3 ELSE 2 END as available_count
FROM doctors d
CROSS JOIN (
    SELECT 0 as day_offset UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION 
    SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION 
    SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) n
CROSS JOIN (
    SELECT '8-9' as time_slot UNION SELECT '9-10' UNION SELECT '10-11' UNION SELECT '11-12' UNION
    SELECT '14-15' UNION SELECT '15-16' UNION SELECT '16-17' UNION SELECT '17-18'
) t
WHERE DATE_ADD(CURDATE(), INTERVAL n.day_offset DAY) >= CURDATE()
  AND DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL n.day_offset DAY)) BETWEEN 2 AND 6; -- 周一到周五

-- 插入测试预约数据
INSERT INTO appointments (patient_id, doctor_id, appointment_time, time_slot, status, symptom_description, fee, order_number, department_location) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), '9-10', 0, '腹部不适，需要做腹部超声检查', 91.00, CONCAT('ORD', UNIX_TIMESTAMP(), '001'), '门诊楼3楼超声科'),
(2, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), '10-11', 0, '心脏不适', 91.00, CONCAT('ORD', UNIX_TIMESTAMP(), '002'), '门诊楼3楼超声科'),
(1, 3, DATE_ADD(NOW(), INTERVAL -1 DAY), '14-15', 1, '妇科检查', 91.00, CONCAT('ORD', UNIX_TIMESTAMP(), '003'), '门诊楼3楼超声科');

