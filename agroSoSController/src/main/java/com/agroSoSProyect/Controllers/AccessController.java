package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Access.AccessNotFoundException;
import com.agroSoSProyect.Models.Access;
import com.agroSoSProyect.Repository.AccessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class AccessController {

  @Autowired
  private AccessRepository accessRepository;

  @GetMapping("/api/access")
  List<Access> getAllAccess() {
    return accessRepository.findAll();
  }

  @GetMapping("/api/access/{id}")
  Access getAccessById(@PathVariable Long id) {
    return accessRepository.findById(id)
        .orElseThrow(() -> new AccessNotFoundException(id));
  }

  @GetMapping("/api/access/user/{userId}")
  List<Access> getAccessByUserId(@PathVariable Long userId) {
    return accessRepository.findByUser(userId);
  }

  @PostMapping("/api/access")
  Access newAccess(@RequestBody Access newAccess) {
    return accessRepository.save(newAccess);
  }

  @DeleteMapping("/api/access/{id}")
  String deleteAccess(@PathVariable Long id) {
    if (!accessRepository.existsById(id)) {
      throw new AccessNotFoundException(id);
    }
    accessRepository.deleteById(id);
    return "Access with id " + id + " has been deleted success.";
  }
}
