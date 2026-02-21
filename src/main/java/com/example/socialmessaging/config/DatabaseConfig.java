package com.example.socialmessaging.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Value("${JDBC_DATABASE_URL:}")
    private String jdbcDatabaseUrl;

    @Bean
    public DataSource dataSource() {
        // If JDBC_DATABASE_URL is provided, use it directly
        if (jdbcDatabaseUrl != null && !jdbcDatabaseUrl.isEmpty()) {
            HikariDataSource dataSource = new HikariDataSource();
            dataSource.setJdbcUrl(jdbcDatabaseUrl);
            return dataSource;
        }
        
        // Fallback to default configuration
        return DataSourceBuilder.create().build();
    }
}
