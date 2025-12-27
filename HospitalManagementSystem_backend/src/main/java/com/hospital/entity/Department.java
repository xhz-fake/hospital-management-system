package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 科室实体类
 */
@Data
@TableName("departments")
public class Department {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private String description;
    
    private LocalDateTime createdTime;
    
    private LocalDateTime updatedTime;
}

