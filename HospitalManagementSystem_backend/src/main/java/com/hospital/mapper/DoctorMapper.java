package com.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hospital.entity.Doctor;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DoctorMapper extends BaseMapper<Doctor> {
    /**
     * 查询医生列表（带科室信息）
     */
    IPage<Doctor> selectDoctorsWithDepartment(Page<Doctor> page, 
                                               @Param("departmentId") Long departmentId,
                                               @Param("title") String title,
                                               @Param("status") Integer status);
}

