package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;
@RequestMapping("/api/auth")
@RestController
@CrossOrigin("http://localhost:3000")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/login")
  public String login(@RequestBody User loginRequest) {
    Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

    if (userOptional.isPresent()) {
      User user = userOptional.get();

      if (user.getPassword().equals(loginRequest.getPassword())) {
        return "Login exitoso para el usuario: " + user.getName();
      }
    }

    return "Email o contraseña incorrectos.";
  }

}