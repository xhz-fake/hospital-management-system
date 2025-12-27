package com.hospital.config.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeTolerantDeserializer extends JsonDeserializer<LocalDateTime> {

	private static final DateTimeFormatter SPACE_SECONDS = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	private static final DateTimeFormatter SPACE_MINUTES = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
	private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

	@Override
	public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		String text = p.getText();
		if (text == null) return null;
		text = text.trim().replace('/', '-');
		// yyyy-MM-dd HH:mm:ss
		try {
			return LocalDateTime.parse(text, SPACE_SECONDS);
		} catch (Exception ignored) { }
		// yyyy-MM-dd HH:mm
		try {
			return LocalDateTime.parse(text, SPACE_MINUTES);
		} catch (Exception ignored) { }
		// yyyy-MM-dd'T'H:mm (单数字小时)
		try {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'H:mm");
			return LocalDateTime.parse(text, formatter);
		} catch (Exception ignored) { }
		// ISO yyyy-MM-dd'T'HH:mm[:ss]
		try {
			return LocalDateTime.parse(text, ISO);
		} catch (Exception e) {
			// 如果是空格分隔，转成 'T' 再试一次
			if (text.length() > 10 && text.charAt(10) == ' ') {
				String isoLike = text.substring(0, 10) + "T" + text.substring(11);
				return LocalDateTime.parse(isoLike, ISO);
			}
			// 如果是 'T' 且小时只有一位，补零后再试
			if (text.length() > 11 && text.charAt(10) == 'T' && text.charAt(11) != '0' && text.charAt(12) == ':') {
				String padded = text.substring(0, 11) + "0" + text.substring(11);
				return LocalDateTime.parse(padded, ISO);
			}
			throw e;
		}
	}
}


