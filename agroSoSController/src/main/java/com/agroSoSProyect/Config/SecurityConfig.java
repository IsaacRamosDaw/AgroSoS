package com.agroSoSProyect.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  // Deshabilitar CSRF (Cross-Site Request Forgery) para permitir peticiones desde el frontend libremente
  // Habrá que crear reglas específicas para cada endpoint ya que esto no es muy seguro
  // Permite "Todo" desde la url que contiene "auth"
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**")
            .permitAll()
            .anyRequest()
            .permitAll()
        );
    return http.build();
  }

  // Método para hashear las contraseñas en authController
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
