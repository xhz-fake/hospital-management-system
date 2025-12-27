package com.hospital;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.hospital.mapper")
public class HospitalManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
    }
}


