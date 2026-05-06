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
    return accessRepository.findByUser_Id(userId);
  }

  @GetMapping("/api/access/device/{deviceId}")
  List<Access> getAccessByDeviceId(@PathVariable Long deviceId) {
    return accessRepository.findByDevice_Id(deviceId);
  }

  @PostMapping("/api/access")
  Access newAccess(@RequestBody Access newAccess) {
    if (newAccess.getUser() == null || newAccess.getDevice() == null) {
      throw new IllegalArgumentException("User and device must not be null");
    }
    return accessRepository.save(newAccess);
  }

  @PutMapping("/api/access/{id}")
  Access updateAccess(@RequestBody Access updated, @PathVariable Long id) {
    if (updated.getUser() == null || updated.getDevice() == null) {
      throw new IllegalArgumentException("User and device must not be null");
    }
    return accessRepository.findById(id)
        .map(access -> {
          access.setUser(updated.getUser());
          access.setDevice(updated.getDevice());
          return accessRepository.save(access);
        })
        .orElseThrow(() -> new AccessNotFoundException(id));
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
