package com.hospital.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    /**
     * 创建预约
     */
    Appointment create(Appointment appointment);
    
    /**
     * 取消预约
     */
    boolean cancel(Long appointmentId, Long patientId);
    
    /**
     * 更新预约状态
     */
    boolean updateStatus(Long appointmentId, Integer status);
    
    /**
     * 查询患者预约列表
     */
    Page<Appointment> listPatientAppointments(Page<Appointment> page, Long patientId);
    
    /**
     * 查询医生今日预约
     */
    List<Appointment> listTodayAppointments(Long doctorId);
    
    /**
     * 根据ID查询预约
     */
    Appointment getById(Long id);
}

