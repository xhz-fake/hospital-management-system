package com.hospital.service;

import com.hospital.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    /**
     * 查询医生排班
     */
    List<Schedule> listSchedules(Long doctorId, LocalDate startDate, LocalDate endDate);
}

