package com.hospital.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Doctor;

import java.util.List;

public interface DoctorService {
    /**
     * 医生登录
     */
    Doctor login(String username, String password);
    
    /**
     * 根据ID查询医生
     */
    Doctor getById(Long id);
    
    /**
     * 分页查询医生列表
     */
    Page<Doctor> listDoctors(Page<Doctor> page, Long departmentId, String title, Integer status);
    
    /**
     * 查询所有医生
     */
    List<Doctor> listAll();
}

