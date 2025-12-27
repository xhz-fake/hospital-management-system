package com.hospital.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.common.Result;
import com.hospital.entity.Patient;
import com.hospital.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {
    
    private final PatientService patientService;
    
    /**
     * 患者注册/添加就诊人
     */
    @PostMapping("/register")
    public Result<Patient> register(@RequestBody @Validated Patient patient) {
        try {
            Patient result = patientService.register(patient);
            return Result.success("添加就诊人成功", result);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 根据身份证号查询患者
     */
    @GetMapping("/idcard/{idCard}")
    public Result<Patient> getByIdCard(@PathVariable String idCard) {
        Patient patient = patientService.getByIdCard(idCard);
        if (patient == null) {
            return Result.error("患者不存在");
        }
        return Result.success(patient);
    }
    
    /**
     * 根据ID查询患者
     */
    @GetMapping("/{id}")
    public Result<Patient> getById(@PathVariable Long id) {
        Patient patient = patientService.getById(id);
        if (patient == null) {
            return Result.error("患者不存在");
        }
        return Result.success(patient);
    }
    
    /**
     * 更新患者信息
     */
    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Patient patient) {
        patient.setId(id);
        boolean success = patientService.update(patient);
        return success ? Result.success("更新成功") : Result.error("更新失败");
    }
    
    /**
     * 删除患者
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        boolean success = patientService.delete(id);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }
    
    /**
     * 分页查询患者（医生端）
     */
    @GetMapping("/list")
    public Result<Page<Patient>> listPatients(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        Page<Patient> page = new Page<>(current, size);
        Page<Patient> result = patientService.listPatients(page, keyword);
        return Result.success(result);
    }
}

