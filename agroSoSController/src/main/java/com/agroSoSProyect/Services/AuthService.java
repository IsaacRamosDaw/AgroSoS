package com.agroSoSProyect.Services;

import com.agroSoSProyect.Models.RefreshToken;
import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.DeviceRepository;
import com.agroSoSProyect.Repository.RefreshTokenRepository;
import com.agroSoSProyect.Repository.UserRepository;
import com.agroSoSProyect.dto.AuthRequest;
import com.agroSoSProyect.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final DeviceRepository deviceRepository;

    @Transactional
    public Map<String, Object> register(AuthRequest request) {
        User existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser != null) {
            return Map.of("success", false, "message", "El email ya está registrado");
        }

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getName() != null && !request.getName().isEmpty()) {
            newUser.setName(request.getName());
        } else {
            newUser.setName(request.getEmail().split("@")[0]);
        }
        
        User savedUser = userRepository.save(newUser);
        
        String accessToken = jwtService.generateToken(savedUser.getEmail());
        RefreshToken refreshToken = createRefreshToken(savedUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuario registrado correctamente");
        response.put("user", savedUser);
        response.put("device", deviceRepository.findByUser(savedUser.getId()));
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());

        return response;
    }

    @Transactional
    public Map<String, Object> login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return Map.of("success", false, "message", "Usuario no encontrado");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuario logueado correctamente");
        response.put("user", user);
        response.put("device", deviceRepository.findByUser(user.getId()));
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());

        return response;
    }

    @Transactional
    public Map<String, Object> refresh(String refreshTokenValue) {
        return validateRefreshToken(refreshTokenValue)
                .map(refreshToken -> {
                    User user = userRepository.findByEmail(refreshToken.getEmail());
                    String newAccessToken = jwtService.generateToken(user.getEmail());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("accessToken", newAccessToken);
                    response.put("refreshToken", refreshTokenValue);
                    return response;
                })
                .orElse(Map.of("success", false, "message", "Refresh token is invalid or expired"));
    }

    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }

    @Transactional
    public RefreshToken createRefreshToken(String email) {
        refreshTokenRepository.deleteByEmail(email); // Delete old one if exists

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setEmail(email);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(86400000L)); // 24 hours
        
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(refreshToken -> {
                    if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0) {
                        refreshTokenRepository.delete(refreshToken);
                        return null;
                    }
                    return refreshToken;
                });
    }
}
