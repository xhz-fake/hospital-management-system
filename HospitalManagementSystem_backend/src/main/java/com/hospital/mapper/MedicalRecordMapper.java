package com.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hospital.entity.MedicalRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MedicalRecordMapper extends BaseMapper<MedicalRecord> {
	/**
	 * 按患者ID查询病历（携带患者名、医生名）
	 */
	java.util.List<MedicalRecord> selectByPatientWithJoins(@org.apache.ibatis.annotations.Param("patientId") Long patientId);
}

