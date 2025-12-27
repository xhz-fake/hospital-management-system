package com.hospital.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5加密工具类
 */
public class MD5Util {
    
    /**
     * MD5加密
     * @param password 明文密码
     * @return MD5加密后的字符串（32位小写）
     */
    public static String encrypt(String password) {
        if (password == null || password.isEmpty()) {
            return null;
        }
        
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    sb.append('0');
                }
                sb.append(hex);
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5加密失败", e);
        }
    }
    
    /**
     * 验证密码
     * @param inputPassword 用户输入的明文密码
     * @param storedPassword 数据库中存储的MD5加密密码
     * @return 是否匹配
     */
    public static boolean verify(String inputPassword, String storedPassword) {
        if (inputPassword == null || storedPassword == null) {
            return false;
        }
        String encryptedInput = encrypt(inputPassword);
        return encryptedInput.equals(storedPassword);
    }
}

