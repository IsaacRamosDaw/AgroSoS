package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Device.DeviceNotFoundException;
import com.agroSoSProyect.Models.Device;
import com.agroSoSProyect.Repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class DeviceController {

  @Autowired
  private DeviceRepository deviceRepository;

  @GetMapping("/api/device")
  List<Device> getAllDevices() {
    return deviceRepository.findAll();
  }

  @GetMapping("/api/device/{id}")
  Device getDeviceById(@PathVariable Long id) {
    return deviceRepository.findById(id)
        .orElseThrow(() -> new DeviceNotFoundException(id));
  }

  @GetMapping("/api/device/user/{userId}")
  List<Device> getDevicesByUser(@PathVariable Long userId) {
    return deviceRepository.findByUser(userId);
  }

  @PostMapping("/api/device")
  Device newDevice(@RequestBody Device newDevice) {
    return deviceRepository.save(newDevice);
  }

  @PutMapping("/api/device/{id}")
  Device updateDevice(@RequestBody Device newDevice, @PathVariable Long id) {
    return deviceRepository.findById(id)
        .map(device -> {
          device.setName(newDevice.getName());
          device.setType(newDevice.getType());
          return deviceRepository.save(device);
        })
        .orElseThrow(() -> new DeviceNotFoundException(id));
  }

  @DeleteMapping("/api/device/{id}")
  String deleteDevice(@PathVariable Long id) {
    if (!deviceRepository.existsById(id)) {
      throw new DeviceNotFoundException(id);
    }
    deviceRepository.deleteById(id);
    return "Device with id " + id + " has been deleted success.";
  }
}
