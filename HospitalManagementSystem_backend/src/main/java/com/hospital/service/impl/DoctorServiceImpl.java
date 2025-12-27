package com.hospital.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hospital.entity.Doctor;
import com.hospital.mapper.DoctorMapper;
import com.hospital.service.DoctorService;
import com.hospital.util.MD5Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    
    private final DoctorMapper doctorMapper;
    
    @Override
    public Doctor login(String username, String password) {
        Doctor doctor = doctorMapper.selectOne(
            new LambdaQueryWrapper<Doctor>()
                .eq(Doctor::getUsername, username)
        );
        
        if (doctor == null) {
            throw new RuntimeException("用户名不存在");
        }
        
        // 密码验证：将输入的明文密码进行MD5加密后与数据库中的MD5值进行比较
        if (!MD5Util.verify(password, doctor.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        return doctor;
    }
    
    @Override
    public Doctor getById(Long id) {
        return doctorMapper.selectById(id);
    }
    
    @Override
    public Page<Doctor> listDoctors(Page<Doctor> page, Long departmentId, String title, Integer status) {
        LambdaQueryWrapper<Doctor> wrapper = new LambdaQueryWrapper<>();
        if (departmentId != null) {
            wrapper.eq(Doctor::getDepartmentId, departmentId);
        }
        if (title != null && !title.isEmpty()) {
            wrapper.eq(Doctor::getTitle, title);
        }
        if (status != null) {
            wrapper.eq(Doctor::getStatus, status);
        }
        doctorMapper.selectPage(page, wrapper);
        return page;
    }
    
    @Override
    public List<Doctor> listAll() {
        return doctorMapper.selectList(null);
    }
}
