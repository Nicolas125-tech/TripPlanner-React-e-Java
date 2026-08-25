package com.nicolas.tripplanner.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceUrlFixer implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSourceProperties properties) {
            String url = properties.getUrl();

            // Render injects SPRING_DATASOURCE_URL as 'postgresql://...'
            // Spring Boot JDBC requires 'jdbc:postgresql://...'
            if (url != null && url.startsWith("postgresql://")) {
                properties.setUrl("jdbc:" + url);
                properties.setDriverClassName("org.postgresql.Driver");
            }
        }
        return bean;
    }
}
