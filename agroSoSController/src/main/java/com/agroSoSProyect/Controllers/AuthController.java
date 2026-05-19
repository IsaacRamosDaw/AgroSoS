package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.UserRepository;
import com.agroSoSProyect.Repository.DeviceRepository;
import com.agroSoSProyect.Services.AuthService;
import com.agroSoSProyect.dto.AuthRequest;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/bootstrap-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> bootstrapAdmin(@RequestBody User adminData) {
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRole() == com.agroSoSProyect.Models.Role.ADMIN);
        if (adminExists) {
            return Map.of("success", false, "message", "Ya existe un administrador en el sistema");
        }
        User existing = userRepository.findByEmail(adminData.getEmail());
        if (existing != null) {
            existing.setRole(com.agroSoSProyect.Models.Role.ADMIN);
            userRepository.save(existing);
            return Map.of("success", true, "message", "Usuario existente promovido a administrador");
        }
        adminData.setPassword(hashPassword(adminData.getPassword()));
        adminData.setRole(com.agroSoSProyect.Models.Role.ADMIN);
        User saved = userRepository.save(adminData);
        return Map.of("success", true, "message", "Administrador creado correctamente", "user", saved);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody AuthRequest loginData) {
        return authService.login(loginData);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@Valid @RequestBody AuthRequest newUser) {
        return authService.register(newUser);
    }

    @PostMapping("/refresh")
    public Map<String, Object> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return Map.of("success", false, "message", "Refresh token is required");
        }
        return authService.refresh(refreshToken);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.logout(email);
        return Map.of("success", true, "message", "Logout exitoso");
    }

    @PostMapping("/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> promoteToAdmin(@RequestBody Map<String, Long> data) {
        if (data == null) {
            return Map.of("success", false, "message", "Se proporciono un objeto null");
        }
        Long requesterId = data.get("requesterId");
        Long targetUserId = data.get("targetUserId");
        if (requesterId == null) {
            return Map.of("success", false, "message", "El administrador no se proporciono, es null");
        }
        if (targetUserId == null) {
            return Map.of("success", false, "message", "El usuario a promover no se proporciono, es null");
        }
        if (!isAdmin(requesterId)) {
            return Map.of("success", false, "message", "No tienes permisos de administrador");
        }
        User targetUser = userRepository.findById(targetUserId).orElse(null);
        if (targetUser == null) {
            return Map.of("success", false, "message", "El usuario a promover no se encontro");
        }
        if (isAdmin(targetUserId)) {
            return Map.of("success", false, "message", "El usuario ya es administrador");
        }
        targetUser.setRole(com.agroSoSProyect.Models.Role.ADMIN);
        userRepository.save(targetUser);
        return Map.of("success", true, "message", "El usuario se promovio correctamente");
    }

    @PostMapping("/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> revokeAdmin(@RequestBody Map<String, Long> data) {
        if (data == null) {
            return Map.of("success", false, "message", "Se proporciono un objeto null");
        }
        Long requesterId = data.get("requesterId");
        Long targetUserId = data.get("targetUserId");
        if (requesterId == null) {
            return Map.of("success", false, "message", "El administrador no se proporciono, es null");
        }
        if (targetUserId == null) {
            return Map.of("success", false, "message", "El usuario a revocar no se proporciono, es null");
        }
        if (!isAdmin(requesterId)) {
            return Map.of("success", false, "message", "No tienes permisos de administrador");
        }
        User targetUser = userRepository.findById(targetUserId).orElse(null);
        if (targetUser == null) {
            return Map.of("success", false, "message", "El usuario a revocar no se encontro");
        }
        if (!isAdmin(targetUserId)) {
            return Map.of("success", false, "message", "El usuario no es administrador");
        }
        targetUser.setRole(com.agroSoSProyect.Models.Role.USER);
        userRepository.save(targetUser);
        return Map.of("success", true, "message", "Se han revocado los permisos de administrador correctamente");
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody User newUser) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail);

        if (currentUser == null) {
             return Map.of("success", false, "message", "Usuario actual no autenticado");
        }

        if (!currentUser.getId().equals(id) && currentUser.getRole() != com.agroSoSProyect.Models.Role.ADMIN) {
             return Map.of("success", false, "message", "No tienes permiso para actualizar este usuario");
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return Map.of("success", false, "message", "Usuario no encontrado");
        }

        if (newUser.getName() != null)
            user.setName(newUser.getName());
        if (newUser.getEmail() != null)
            user.setEmail(newUser.getEmail());

        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            user.setPassword(hashPassword(newUser.getPassword()));
        }

        User savedUser = userRepository.save(user);

        return Map.of(
                "success", true,
                "message", "Usuario actualizado correctamente",
                "user", savedUser,
                "device", deviceRepository.findByUser(savedUser.getId()));
    }

    private boolean isAdmin(Long userId) {
        if (userId == null) {
            return false;
        }
        User user = userRepository.findById(userId).orElse(null);
        return user != null && user.getRole() == com.agroSoSProyect.Models.Role.ADMIN;
    }

    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }
}
