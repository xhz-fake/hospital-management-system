package com.hospital.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hospital.entity.Patient;
import com.hospital.mapper.PatientMapper;
import com.hospital.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {
    
    private final PatientMapper patientMapper;
    
    @Override
    @Transactional
    public Patient register(Patient patient) {
        // 检查身份证号是否已存在
        Patient existPatient = patientMapper.selectOne(
            new LambdaQueryWrapper<Patient>()
                .eq(Patient::getIdCard, patient.getIdCard())
        );
        
        if (existPatient != null) {
            throw new RuntimeException("该身份证号已存在，不能重复添加");
        }
        
        // 根据身份证号计算年龄和性别
        if (patient.getIdCard() != null && patient.getIdCard().length() == 18) {
            String birthStr = patient.getIdCard().substring(6, 14);
            int year = Integer.parseInt(birthStr.substring(0, 4));
            int month = Integer.parseInt(birthStr.substring(4, 6));
            int day = Integer.parseInt(birthStr.substring(6, 8));
            patient.setBirthDate(LocalDate.of(year, month, day));
            
            // 计算年龄
            Period period = Period.between(patient.getBirthDate(), LocalDate.now());
            patient.setAge(period.getYears());
            
            // 获取性别（倒数第二位）
            int genderCode = Integer.parseInt(patient.getIdCard().substring(16, 17));
            patient.setGender(genderCode % 2);
        }
        
        patientMapper.insert(patient);
        return patient;
    }
    
    @Override
    public Patient getByIdCard(String idCard) {
        return patientMapper.selectOne(
            new LambdaQueryWrapper<Patient>()
                .eq(Patient::getIdCard, idCard)
        );
    }
    
    @Override
    public Patient getById(Long id) {
        return patientMapper.selectById(id);
    }
    
    @Override
    @Transactional
    public boolean update(Patient patient) {
        return patientMapper.updateById(patient) > 0;
    }
    
    @Override
    @Transactional
    public boolean delete(Long id) {
        return patientMapper.deleteById(id) > 0;
    }
    
    @Override
    public Page<Patient> listPatients(Page<Patient> page, String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            patientMapper.selectPage(page,
                new LambdaQueryWrapper<Patient>()
                    .like(Patient::getName, keyword)
                    .or()
                    .like(Patient::getPhone, keyword)
                    .or()
                    .like(Patient::getIdCard, keyword)
            );
            return page;
        }
        patientMapper.selectPage(page, null);
        return page;
    }
}

