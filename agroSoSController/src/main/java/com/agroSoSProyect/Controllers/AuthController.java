package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginData) {
        User user = userRepository.findByEmail(loginData.getEmail());

        if (user == null) {
            return Map.of(
              "success", false,
              "message", "Usuario no encontrado");
        }

        if (!user.getPassword().equals(loginData.getPassword())) {
            return Map.of(
              "success", false,
              "message", "Contraseña incorrecta");
        }

        return Map.of(
            "success", true,
            "message", "Login exitoso",
            "user", user);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User newUser) {
        User existingUser = userRepository.findByEmail(newUser.getEmail());

        if (existingUser != null) {
            return Map.of(
              "success", false,
              "message", "El email ya está registrado");
        }

        User savedUser = userRepository.save(newUser);

        return Map.of(
                "success", true,
                "message", "Usuario registrado correctamente",
                "user", savedUser);
    }

}
