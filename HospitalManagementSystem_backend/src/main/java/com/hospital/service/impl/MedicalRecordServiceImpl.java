package com.hospital.service.impl;

import com.hospital.entity.MedicalRecord;
import com.hospital.mapper.MedicalRecordMapper;
import com.hospital.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {
    
    private final MedicalRecordMapper medicalRecordMapper;
    
    @Override
    public MedicalRecord create(MedicalRecord record) {
        medicalRecordMapper.insert(record);
        return record;
    }
    
    @Override
    public List<MedicalRecord> listPatientRecords(Long patientId) {
        return medicalRecordMapper.selectByPatientWithJoins(patientId);
    }
}

