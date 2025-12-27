package com.hospital.service;

import com.hospital.entity.Department;

import java.util.List;

public interface DepartmentService {
    /**
     * 查询所有科室
     */
    List<Department> listAll();
    
    /**
     * 根据ID查询科室
     */
    Department getById(Long id);
}

