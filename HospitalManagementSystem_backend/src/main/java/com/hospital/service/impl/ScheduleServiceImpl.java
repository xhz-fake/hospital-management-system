package com.hospital.service.impl;

import com.hospital.entity.Schedule;
import com.hospital.mapper.ScheduleMapper;
import com.hospital.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    
    private final ScheduleMapper scheduleMapper;
    
    @Override
    public List<Schedule> listSchedules(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return scheduleMapper.selectSchedulesByDoctor(doctorId, startDate, endDate);
    }
}

