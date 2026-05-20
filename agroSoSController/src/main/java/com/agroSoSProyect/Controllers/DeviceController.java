package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Device.DeviceNotFoundException;
import com.agroSoSProyect.Models.Device;
import com.agroSoSProyect.Models.User;
import com.agroSoSProyect.Models.Role;
import com.agroSoSProyect.Repository.AccessRepository;
import com.agroSoSProyect.Repository.DeviceRepository;
import com.agroSoSProyect.Repository.PlantRepository;
import com.agroSoSProyect.Repository.ReadingRepository;
import com.agroSoSProyect.Repository.SensorRepository;
import com.agroSoSProyect.Repository.UserRepository;
import com.agroSoSProyect.Services.DataGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class DeviceController {

  @Autowired private DeviceRepository deviceRepository;
  @Autowired private DataGeneratorService dataGeneratorService;
  @Autowired private SensorRepository sensorRepository;
  @Autowired private ReadingRepository readingRepository;
  @Autowired private PlantRepository plantRepository;
  @Autowired private AccessRepository accessRepository;
  @Autowired private UserRepository userRepository;

  private void checkAccess(Long deviceUserId) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User currentUser = userRepository.findByEmail(email);
    if (currentUser == null) {
      throw new AccessDeniedException("Usuario no autenticado");
    }
    if (currentUser.getRole() != Role.ADMIN && (deviceUserId == null || !currentUser.getId().equals(deviceUserId))) {
      throw new AccessDeniedException("No tienes permiso para acceder a este dispositivo");
    }
  }

  @GetMapping("/api/device")
  List<Device> getAllDevices() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User currentUser = userRepository.findByEmail(email);
    if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
      throw new AccessDeniedException("Solo los administradores pueden listar todos los dispositivos");
    }
    return deviceRepository.findAll();
  }

  @GetMapping("/api/device/{id}")
  Device getDeviceById(@PathVariable Long id) {
    Device device = deviceRepository.findById(id)
        .orElseThrow(() -> new DeviceNotFoundException(id));
    checkAccess(device.getUser());
    return device;
  }

  @GetMapping("/api/device/user/{userId}")
  List<Device> getDevicesByUser(@PathVariable Long userId) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User currentUser = userRepository.findByEmail(email);
    if (currentUser == null) {
      throw new AccessDeniedException("Usuario no autenticado");
    }
    if (currentUser.getRole() != Role.ADMIN && !currentUser.getId().equals(userId)) {
      throw new AccessDeniedException("No tienes permiso para ver los dispositivos de este usuario");
    }
    return deviceRepository.findByUser(userId);
  }

  @PostMapping("/api/device")
  Device newDevice(@RequestBody Device newDevice) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User currentUser = userRepository.findByEmail(email);
    if (currentUser == null) {
      throw new AccessDeniedException("Usuario no autenticado");
    }
    if (newDevice.getUser() == null) {
      newDevice.setUser(currentUser.getId());
    } else {
      if (currentUser.getRole() != Role.ADMIN && !currentUser.getId().equals(newDevice.getUser())) {
        throw new AccessDeniedException("No tienes permiso para crear dispositivos para otro usuario");
      }
    }
    Device saved = deviceRepository.save(newDevice);
    if (saved.getType() != null) {
      dataGeneratorService.createDefaultSensorsForDevice(saved.getId(), saved.getType());
    }
    return saved;
  }

  @PostMapping("/api/device/{id}/init-sensors")
  Device initSensors(@PathVariable Long id) {
    Device device = deviceRepository.findById(id)
        .orElseThrow(() -> new DeviceNotFoundException(id));
    checkAccess(device.getUser());
    boolean hasSensors = !sensorRepository.findByDevice(id).isEmpty();
    if (!hasSensors && device.getType() != null) {
      dataGeneratorService.createDefaultSensorsForDevice(id, device.getType());
    }
    return device;
  }

  @PutMapping("/api/device/{id}")
  Device updateDevice(@RequestBody Device newDevice, @PathVariable Long id) {
    Device device = deviceRepository.findById(id)
        .orElseThrow(() -> new DeviceNotFoundException(id));
    checkAccess(device.getUser());

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User currentUser = userRepository.findByEmail(email);
    if (newDevice.getUser() != null && !newDevice.getUser().equals(device.getUser())) {
      if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
        throw new AccessDeniedException("No tienes permiso para cambiar el propietario de este dispositivo");
      }
      device.setUser(newDevice.getUser());
    }

    device.setName(newDevice.getName());
    device.setType(newDevice.getType());
    return deviceRepository.save(device);
  }

  @DeleteMapping("/api/device/{id}")
  String deleteDevice(@PathVariable Long id) {
    Device device = deviceRepository.findById(id)
        .orElseThrow(() -> new DeviceNotFoundException(id));
    checkAccess(device.getUser());

    readingRepository.deleteByDevice(id);
    sensorRepository.deleteByDevice(id);
    plantRepository.deleteByDeviceId(id);
    accessRepository.deleteByDevice_Id(id);
    deviceRepository.deleteById(id);
    return "Device with id " + id + " has been deleted success.";
  }
}

