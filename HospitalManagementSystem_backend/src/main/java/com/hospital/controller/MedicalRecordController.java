package com.hospital.controller;

import com.hospital.common.Result;
import com.hospital.entity.MedicalRecord;
import com.hospital.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {
    
    private final MedicalRecordService medicalRecordService;
    
    /**
     * 创建病历
     */
    @PostMapping("/create")
    public Result<MedicalRecord> create(@RequestBody MedicalRecord record) {
        MedicalRecord result = medicalRecordService.create(record);
        return Result.success("创建病历成功", result);
    }
    
    /**
     * 查询患者病历
     */
    @GetMapping("/patient/{patientId}")
    public Result<List<MedicalRecord>> listPatientRecords(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordService.listPatientRecords(patientId);
        return Result.success(records);
    }
}

