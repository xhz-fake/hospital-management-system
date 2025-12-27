package com.hospital.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 患者实体类
 */
@Data
@TableName("patients")
public class Patient {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @NotBlank(message = "姓名不能为空")
    private String name;
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "身份证号不能为空")
    @Pattern(regexp = "^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]$", 
             message = "身份证号格式不正确")
    private String idCard;
    
    private Integer gender; // 0-女，1-男
    
    private Integer age;
    
    private String residence;
    
    private String address;
    
    private LocalDate birthDate;
    
    private String openid; // 微信openid
    
    private LocalDateTime createdTime;
    
    private LocalDateTime updatedTime;
}

