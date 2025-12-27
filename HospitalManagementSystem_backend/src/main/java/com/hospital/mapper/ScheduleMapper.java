package com.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hospital.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {
    /**
     * 查询医生排班
     */
    List<Schedule> selectSchedulesByDoctor(@Param("doctorId") Long doctorId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}

