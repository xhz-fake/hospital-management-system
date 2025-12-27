package com.hospital.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Patient;

public interface PatientService {
    /**
     * 患者注册/添加就诊人
     */
    Patient register(Patient patient);
    
    /**
     * 根据身份证号查询患者
     */
    Patient getByIdCard(String idCard);
    
    /**
     * 根据ID查询患者
     */
    Patient getById(Long id);
    
    /**
     * 更新患者信息
     */
    boolean update(Patient patient);
    
    /**
     * 删除患者
     */
    boolean delete(Long id);
    
    /**
     * 分页查询患者（医生端使用）
     */
    Page<Patient> listPatients(Page<Patient> page, String keyword);
}

