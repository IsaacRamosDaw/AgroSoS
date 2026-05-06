package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Device.DeviceNotFoundException;
import com.agroSoSProyect.Models.Device;
import com.agroSoSProyect.Repository.AccessRepository;
import com.agroSoSProyect.Repository.DeviceRepository;
import com.agroSoSProyect.Repository.PlantRepository;
import com.agroSoSProyect.Repository.ReadingRepository;
import com.agroSoSProyect.Repository.SensorRepository;
import com.agroSoSProyect.Services.DataGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
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
    boolean hasSensors = !sensorRepository.findByDevice(id).isEmpty();
    if (!hasSensors && device.getType() != null) {
      dataGeneratorService.createDefaultSensorsForDevice(id, device.getType());
    }
    return device;
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
    readingRepository.deleteByDevice(id);
    sensorRepository.deleteByDevice(id);
    plantRepository.deleteByDeviceId(id);
    accessRepository.deleteByDevice_Id(id);
    deviceRepository.deleteById(id);
    return "Device with id " + id + " has been deleted success.";
  }
}
