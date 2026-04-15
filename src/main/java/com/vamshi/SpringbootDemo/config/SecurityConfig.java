package com.vamshi.SpringbootDemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/customers/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.CUSTOMER_EDITOR)
                        .requestMatchers(HttpMethod.PUT, "/customers/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.CUSTOMER_EDITOR)
                        .requestMatchers(HttpMethod.POST, "/inventory/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.INVENTORY_EDITOR)
                        .requestMatchers(HttpMethod.PUT, "/inventory/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.INVENTORY_EDITOR)
                        .requestMatchers(HttpMethod.POST, "/orders/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.ORDER_EDITOR)
                        .requestMatchers(HttpMethod.PUT, "/orders/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.ORDER_EDITOR)
                        .requestMatchers(HttpMethod.POST, "/billing/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.BILLING_EDITOR)
                        .requestMatchers(HttpMethod.PUT, "/billing/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.BILLING_EDITOR)
                        .requestMatchers(HttpMethod.POST, "/shipping/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.SHIPPING_EDITOR)
                        .requestMatchers(HttpMethod.PUT, "/shipping/**").hasAnyRole(SecurityRoles.ADMIN, SecurityRoles.SHIPPING_EDITOR)
                        .anyRequest().permitAll()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        return new InMemoryUserDetailsManager(
                User.withUsername("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .roles(
                                SecurityRoles.ADMIN,
                                SecurityRoles.CUSTOMER_EDITOR,
                                SecurityRoles.INVENTORY_EDITOR,
                                SecurityRoles.ORDER_EDITOR,
                                SecurityRoles.BILLING_EDITOR,
                                SecurityRoles.SHIPPING_EDITOR
                        )
                        .build(),
                User.withUsername("customer_manager")
                        .password(passwordEncoder.encode("cust123"))
                        .roles(SecurityRoles.CUSTOMER_EDITOR)
                        .build(),
                User.withUsername("inventory_manager")
                        .password(passwordEncoder.encode("inv123"))
                        .roles(SecurityRoles.INVENTORY_EDITOR)
                        .build(),
                User.withUsername("order_manager")
                        .password(passwordEncoder.encode("order123"))
                        .roles(SecurityRoles.ORDER_EDITOR)
                        .build(),
                User.withUsername("billing_manager")
                        .password(passwordEncoder.encode("bill123"))
                        .roles(SecurityRoles.BILLING_EDITOR)
                        .build(),
                User.withUsername("shipping_manager")
                        .password(passwordEncoder.encode("ship123"))
                        .roles(SecurityRoles.SHIPPING_EDITOR)
                        .build()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
