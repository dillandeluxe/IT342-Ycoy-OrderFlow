package edu.cit.ycoy.orderflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

  @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Crucial for POST requests from PowerShell/Postman
        .cors(cors -> cors.disable()) // Disable CORS for now to avoid lab network issues
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll() // White-lists everything under /api/auth
            .anyRequest().authenticated()
        );
    
    return http.build();
}
}