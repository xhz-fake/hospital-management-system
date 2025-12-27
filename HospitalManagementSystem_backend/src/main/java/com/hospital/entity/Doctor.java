package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 医生实体类
 */
@Data
@TableName("doctors")
public class Doctor {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Long departmentId;
    
    private String title;
    
    private String introduction;
    
    private String expertise;
    
    private String avatarUrl;
    
    private Integer status; // 0-不可咨询，1-可咨询
    
    private String username;
    
    private String password;
    
    private LocalDateTime createdTime;
    
    private LocalDateTime updatedTime;
}

