package com.hospital.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Appointment;
import com.hospital.entity.Schedule;
import com.hospital.mapper.AppointmentMapper;
import com.hospital.mapper.ScheduleMapper;
import com.hospital.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
    
    private final AppointmentMapper appointmentMapper;
    private final ScheduleMapper scheduleMapper;
    
    @Override
    @Transactional
    public Appointment create(Appointment appointment) {
        // 检查时间段是否可预约
        LocalDate workDate = appointment.getAppointmentTime().toLocalDate();
        Schedule schedule = scheduleMapper.selectOne(
            new LambdaQueryWrapper<Schedule>()
                .eq(Schedule::getDoctorId, appointment.getDoctorId())
                .eq(Schedule::getWorkDate, workDate)
                .eq(Schedule::getTimeSlot, appointment.getTimeSlot())
        );
        
        if (schedule == null || schedule.getAvailableCount() <= 0) {
            throw new RuntimeException("该时间段不可预约");
        }
        
        // 减少可预约数量
        schedule.setAvailableCount(schedule.getAvailableCount() - 1);
        scheduleMapper.updateById(schedule);
        
        // 生成挂号单号
        appointment.setOrderNumber("ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        appointment.setStatus(0); // 待就诊
        appointment.setFee(new java.math.BigDecimal("91.00"));
        
        appointmentMapper.insert(appointment);
        return appointment;
    }
    
    @Override
    @Transactional
    public boolean cancel(Long appointmentId, Long patientId) {
        Appointment appointment = appointmentMapper.selectById(appointmentId);
        if (appointment == null) {
            throw new RuntimeException("预约不存在");
        }
        
        if (!appointment.getPatientId().equals(patientId)) {
            throw new RuntimeException("无权取消该预约");
        }
        
        if (appointment.getStatus() != 0) {
            throw new RuntimeException("只能取消待就诊的预约");
        }
        
        // 恢复排班数量
        LocalDate workDate = appointment.getAppointmentTime().toLocalDate();
        Schedule schedule = scheduleMapper.selectOne(
            new LambdaQueryWrapper<Schedule>()
                .eq(Schedule::getDoctorId, appointment.getDoctorId())
                .eq(Schedule::getWorkDate, workDate)
                .eq(Schedule::getTimeSlot, appointment.getTimeSlot())
        );
        
        if (schedule != null) {
            schedule.setAvailableCount(schedule.getAvailableCount() + 1);
            scheduleMapper.updateById(schedule);
        }
        
        appointment.setStatus(2); // 个人取消
        return appointmentMapper.updateById(appointment) > 0;
    }
    
    @Override
    @Transactional
    public boolean updateStatus(Long appointmentId, Integer status) {
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setStatus(status);
        return appointmentMapper.updateById(appointment) > 0;
    }
    
    @Override
    public Page<Appointment> listPatientAppointments(Page<Appointment> page, Long patientId) {
        appointmentMapper.selectPatientAppointments(page, patientId);
        return page;
    }
    
    @Override
    public List<Appointment> listTodayAppointments(Long doctorId) {
        return appointmentMapper.selectTodayAppointmentsByDoctor(doctorId);
    }
    
    @Override
    public Appointment getById(Long id) {
        return appointmentMapper.selectById(id);
    }
}

