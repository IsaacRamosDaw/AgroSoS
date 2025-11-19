package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.User.UserNotFoundException;
import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// Comprobar la ruta con React
@CrossOrigin("http://localhost:3000")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @GetMapping("/api/allUser")
  List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @GetMapping("/api/user/{id}")
  User getUserById(@PathVariable Long id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
  }
  @PostMapping("/api/user")
  User newUser(@RequestBody User newUser) {
    return userRepository.save(newUser);
  }

  @PutMapping("/api/user/{id}")
  User updateUser(@RequestBody User newUser, @PathVariable Long id) {
    return userRepository.findById(id)
    .map(user -> {
      user.setName(newUser.getName());
      user.setEmail(newUser.getEmail());
      user.setPassword(newUser.getPassword());
      return userRepository.save(user);
    })
      .orElseThrow(() -> new UserNotFoundException(id));
  }

  @DeleteMapping("/api/user/{id}")
  String deleteUser(@PathVariable Long id) {
    if (!userRepository.existsById(id)) { throw new UserNotFoundException(id); }
    userRepository.deleteById(id);
    return "User with id " + id + " has been deleted success.";
  }

}