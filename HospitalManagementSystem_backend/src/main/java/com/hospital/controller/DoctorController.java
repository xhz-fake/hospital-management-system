package com.hospital.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.common.Result;
import com.hospital.entity.Doctor;
import com.hospital.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {
    
    private final DoctorService doctorService;
    
    /**
     * 医生登录
     */
    @PostMapping("/login")
    public Result<Doctor> login(@RequestBody LoginRequest request) {
        try {
            Doctor doctor = doctorService.login(request.getUsername(), request.getPassword());
            // 清除密码信息
            doctor.setPassword(null);
            return Result.success("登录成功", doctor);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 查询医生详情
     */
    @GetMapping("/{id}")
    public Result<Doctor> getById(@PathVariable Long id) {
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            return Result.error("医生不存在");
        }
        doctor.setPassword(null);
        return Result.success(doctor);
    }
    
    /**
     * 查询医生列表
     */
    @GetMapping("/list")
    public Result<Page<Doctor>> listDoctors(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer status) {
        Page<Doctor> page = new Page<>(current, size);
        Page<Doctor> result = doctorService.listDoctors(page, departmentId, title, status);
        // 清除密码信息
        result.getRecords().forEach(d -> d.setPassword(null));
        return Result.success(result);
    }
    
    /**
     * 登录请求DTO
     */
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
}

