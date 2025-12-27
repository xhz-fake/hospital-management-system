package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 消息通知实体类
 */
@Data
@TableName("notifications")
public class Notification {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long patientId;
    
    private String type;
    
    private String title;
    
    private String content;
    
    private Long appointmentId;
    
    private Integer isRead;
    
    private LocalDateTime createdTime;
}

