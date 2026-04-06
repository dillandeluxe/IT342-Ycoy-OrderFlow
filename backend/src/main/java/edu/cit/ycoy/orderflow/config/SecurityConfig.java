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
        .cors(cors -> cors.configurationSource(request -> {
            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
            corsConfig.setAllowedOriginPatterns(java.util.List.of("http://localhost:*")); // Allow any localhost port
            corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            corsConfig.setAllowedHeaders(java.util.List.of("*"));
            corsConfig.setAllowCredentials(true);
            return corsConfig;
        })) // Enable CORS with custom configuration
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll() // White-lists everything under /api/auth
            .requestMatchers("/api/food/**").permitAll() // Temporary until JWT/session auth is implemented
            .anyRequest().authenticated()
        );
    
    return http.build();
}
@Bean
public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
    return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
        @Override
        public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175") // Support multiple Vite ports
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    };
}
}