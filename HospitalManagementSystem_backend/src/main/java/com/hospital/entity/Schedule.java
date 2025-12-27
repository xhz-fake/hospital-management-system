package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 排班实体类
 */
@Data
@TableName("schedules")
public class Schedule {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long doctorId;
    
    private LocalDate workDate;
    
    private String timeSlot;
    
    private Integer availableCount;
    
    private LocalDateTime createdTime;
    
    private LocalDateTime updatedTime;
}

