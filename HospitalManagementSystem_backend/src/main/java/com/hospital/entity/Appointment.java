package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hospital.config.json.LocalDateTimeTolerantDeserializer;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 预约实体类
 */
@Data
@TableName("appointments")
public class Appointment {
    @TableId(type = IdType.AUTO)
    private Long id;

    @NotNull(message = "患者ID不能为空")
    private Long patientId;

    @NotNull(message = "医生ID不能为空")
    private Long doctorId;

    @NotNull(message = "预约时间不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeTolerantDeserializer.class)
    private LocalDateTime appointmentTime;

    @NotNull(message = "时间段不能为空")
    private String timeSlot;

    private Integer status; // 0-待就诊，1-已就诊，2-个人取消，3-医生取消

    private String symptomDescription;

    private BigDecimal fee;

    private String orderNumber;

    private String departmentLocation;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeTolerantDeserializer.class)
    private LocalDateTime createdTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeTolerantDeserializer.class)
    private LocalDateTime updatedTime;

    // 扩展信息（非数据库字段）
    @TableField(exist = false)
    private String patientName;

    @TableField(exist = false)
    private String patientPhone;

    @TableField(exist = false)
    private String doctorName;

    @TableField(exist = false)
    private String doctorTitle;

    @TableField(exist = false)
    private String doctorAvatar;

    @TableField(exist = false)
    private String departmentName;
}

