package com.hospital.config;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

	@Bean
	public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
		return builder -> {
			// Accept both "yyyy-MM-dd HH:mm:ss" and ISO "yyyy-MM-dd'T'HH:mm:ss"
			final DateTimeFormatter spaceFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			final DateTimeFormatter spaceNoSecondsFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
			final DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

			LocalDateTimeDeserializer tolerantDeserializer = new LocalDateTimeDeserializer(spaceFormatter) {
				@Override
				public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p,
				                                 com.fasterxml.jackson.databind.DeserializationContext ctxt)
						throws java.io.IOException {
					String text = p.getText();
					if (text == null) return null;
					text = text.trim().replace('/', '-');
					// Try space pattern first
					try {
						return LocalDateTime.parse(text, spaceFormatter);
					} catch (Exception ignored) { }
					// Try without seconds "yyyy-MM-dd HH:mm"
					try {
						return LocalDateTime.parse(text, spaceNoSecondsFormatter);
					} catch (Exception ignored) { }
					// Then try ISO with 'T'
					try {
						return LocalDateTime.parse(text, isoFormatter);
					} catch (Exception e) {
						// Fallback: if there is a space, convert to 'T' and try ISO again
						if (text.length() > 10 && text.charAt(10) == ' ') {
							String isoLike = text.substring(0, 10) + "T" + text.substring(11);
							return LocalDateTime.parse(isoLike, isoFormatter);
						}
						throw e;
					}
				}
			};

			JavaTimeModule javaTimeModule = new JavaTimeModule();
			javaTimeModule.addDeserializer(LocalDateTime.class, tolerantDeserializer);

			builder.modules(javaTimeModule, new SimpleModule());
			builder.simpleDateFormat("yyyy-MM-dd HH:mm:ss");
		};
	}
}


