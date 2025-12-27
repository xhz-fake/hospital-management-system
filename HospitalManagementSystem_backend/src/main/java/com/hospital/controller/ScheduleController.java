package com.hospital.controller;

import com.hospital.common.Result;
import com.hospital.entity.Schedule;
import com.hospital.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    
    /**
     * 查询医生排班
     */
    @GetMapping("/doctor/{doctorId}")
    public Result<List<Schedule>> listSchedules(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Schedule> schedules = scheduleService.listSchedules(doctorId, startDate, endDate);
        return Result.success(schedules);
    }
}

