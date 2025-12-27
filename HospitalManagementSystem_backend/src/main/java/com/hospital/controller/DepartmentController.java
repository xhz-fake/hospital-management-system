package com.hospital.controller;

import com.hospital.common.Result;
import com.hospital.entity.Department;
import com.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    /**
     * 查询所有科室
     */
    @GetMapping("/list")
    public Result<List<Department>> listAll() {
        List<Department> departments = departmentService.listAll();
        return Result.success(departments);
    }
    
    /**
     * 根据ID查询科室
     */
    @GetMapping("/{id}")
    public Result<Department> getById(@PathVariable Long id) {
        Department department = departmentService.getById(id);
        if (department == null) {
            return Result.error("科室不存在");
        }
        return Result.success(department);
    }
}

