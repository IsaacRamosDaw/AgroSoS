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

	@PostMapping("/promote")
	public Map<String, Object> promoteToAdmin(@RequestBody Map<String, Long> data) {

		if (data == null) {
			return Map.of(
					"success", false,
					"message", "Se proporciono un objeto null");
		}

		Long requesterId = data.get("requesterId");
		Long targetUserId = data.get("targetUserId");

		if (requesterId == null) {
			return Map.of(
					"success", false,
					"message", "El administrador no se proporciono, es null");
		}

		if (targetUserId == null) {
			return Map.of(
					"success", false,
					"message", "El usuario a promover no se proporciono, es null");
		}

		User requester = userRepository.findById(requesterId).orElse(null);

		if (requester.getRole() != com.agroSoSProyect.Models.Role.ADMIN) {
			return Map.of(
					"success", false,
					"message", "No tienes permisos de administrador");
		}

		User targetUser = userRepository.findById(targetUserId).orElse(null);

		if (targetUser == null) {
			return Map.of(
					"success", false,
					"message", "El usuario a promover no se encontro");
		}

		if (targetUser.getRole() == com.agroSoSProyect.Models.Role.ADMIN) {
			return Map.of(
					"success", false,
					"message", "El usuario ya es administrador");
		}

		targetUser.setRole(com.agroSoSProyect.Models.Role.ADMIN);
		userRepository.save(targetUser);

		return Map.of(
				"success", true,
				"message", "El usuario se promovio correctamente");
	}

}
