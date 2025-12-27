package com.hospital.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.common.Result;
import com.hospital.entity.Appointment;
import com.hospital.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    /**
     * 创建预约
     */
    @PostMapping("/create")
    public Result<Appointment> create(@RequestBody @Validated Appointment appointment) {
        try {
            Appointment result = appointmentService.create(appointment);
            return Result.success("预约成功", result);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 取消预约
     */
    @PostMapping("/{id}/cancel")
    public Result<?> cancel(@PathVariable Long id, @RequestParam Long patientId) {
        try {
            boolean success = appointmentService.cancel(id, patientId);
            return success ? Result.success("取消预约成功") : Result.error("取消预约失败");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 更新预约状态
     */
    @PutMapping("/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean success = appointmentService.updateStatus(id, status);
        return success ? Result.success("更新成功") : Result.error("更新失败");
    }
    
    /**
     * 查询患者预约列表
     */
    @GetMapping("/patient/{patientId}")
    public Result<Page<Appointment>> listPatientAppointments(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Appointment> page = new Page<>(current, size);
        Page<Appointment> result = appointmentService.listPatientAppointments(page, patientId);
        return Result.success(result);
    }
    
    /**
     * 查询医生今日预约
     */
    @GetMapping("/doctor/{doctorId}/today")
    public Result<List<Appointment>> listTodayAppointments(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.listTodayAppointments(doctorId);
        return Result.success(appointments);
    }
    
    /**
     * 根据ID查询预约
     */
    @GetMapping("/{id}")
    public Result<Appointment> getById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getById(id);
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        return Result.success(appointment);
    }
}

