package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class LoginController {

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/login")
  public String login(@RequestBody User loginData){


  User user = userRepository.findByEmail(loginData.getEmail());
    if (user == null) return "Usuario no encontrado";

    if (user.getPassword().equals(loginData.getPassword())) {
      return "Login exitoso";
    } else {
      return "Contraseña incorrecta";
  }
  }
}
