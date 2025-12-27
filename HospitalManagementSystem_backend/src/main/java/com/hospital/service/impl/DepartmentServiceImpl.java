package com.hospital.service.impl;

import com.hospital.entity.Department;
import com.hospital.mapper.DepartmentMapper;
import com.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    
    private final DepartmentMapper departmentMapper;
    
    @Override
    public List<Department> listAll() {
        return departmentMapper.selectList(null);
    }
    
    @Override
    public Department getById(Long id) {
        return departmentMapper.selectById(id);
    }
}

