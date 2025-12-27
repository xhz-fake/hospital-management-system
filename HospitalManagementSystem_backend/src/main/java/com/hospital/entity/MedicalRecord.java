package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 病历实体类
 */
@Data
@TableName("medical_records")
public class MedicalRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long patientId;
    
    private Long doctorId;
    
    private Long appointmentId;
    
    private String diagnosis;
    
    private String treatment;
    
    private String prescription;
    
    private String recordContent;
    
    private String fileUrl;
    
    private LocalDateTime createdTime;
    
    private LocalDateTime updatedTime;

    @TableField(exist = false)
    private String patientName;

    @TableField(exist = false)
    private String doctorName;
}

