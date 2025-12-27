package com.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Appointment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AppointmentMapper extends BaseMapper<Appointment> {
    /**
     * 查询患者预约列表
     */
    IPage<Appointment> selectPatientAppointments(Page<Appointment> page, 
                                                  @Param("patientId") Long patientId);
    
    /**
     * 查询医生今日预约
     */
    List<Appointment> selectTodayAppointmentsByDoctor(@Param("doctorId") Long doctorId);
}

