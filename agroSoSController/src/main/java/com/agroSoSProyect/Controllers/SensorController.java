package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Sensor.SensorNotFoundException;
import com.agroSoSProyect.Models.Sensor;
import com.agroSoSProyect.Repository.SensorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class SensorController {

  @Autowired
  private SensorRepository sensorRepository;

  @GetMapping("/api/allSensor")
  List<Sensor> getAllSensors() {
    return sensorRepository.findAll();
  }

  @GetMapping("/api/sensor/{id}")
  Sensor getSensorById(@PathVariable Long id) {
    return sensorRepository
        .findById(id)
        .orElseThrow(() -> new SensorNotFoundException(id));
  }

  @GetMapping("/api/sensor/device/{id}")
  List<Sensor> getSensorByDeviceId(@PathVariable Long id) {
    return sensorRepository.findByDevice(id);
  }

  @PostMapping("/api/sensor")
  Sensor newSensor(@RequestBody Sensor newSensor) {
    return sensorRepository.save(newSensor);
  }

  @PutMapping("/api/sensor/{id}")
  Sensor updateSensor(@RequestBody Sensor newSensor, @PathVariable Long id) {
    return sensorRepository.findById(id)
        .map(sensor -> {
          sensor.setPin(newSensor.getPin());
          sensor.setLabel(newSensor.getLabel());
          sensor.setMode(newSensor.getMode());
          return sensorRepository.save(sensor);
        })
        .orElseThrow(() -> new SensorNotFoundException(id));
  }

  @DeleteMapping("/api/sensor/{id}")
  String deleteSensor(@PathVariable Long id) {
    if (!sensorRepository.existsById(id)) {
      throw new SensorNotFoundException(id);
    }
    sensorRepository.deleteById(id);
    return "User with id " + id + " has been deleted success.";
  }
}
