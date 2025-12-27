package com.hospital.service;

import com.hospital.entity.MedicalRecord;

import java.util.List;

public interface MedicalRecordService {
    /**
     * 创建病历
     */
    MedicalRecord create(MedicalRecord record);
    
    /**
     * 查询患者病历
     */
    List<MedicalRecord> listPatientRecords(Long patientId);
}

