package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Sensor.SensorNotFoundException;
import com.agroSoSProyect.Models.Sensor;
import com.agroSoSProyect.Repository.SensorRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class SensorController {

  @Autowired
  private SensorRespository sensorRespository;

  @GetMapping("/api/allSensor")
  List<Sensor> getAllSensors() {
    return sensorRespository.findAll();
  }

  @GetMapping("/api/sensor/{id}")
  Sensor getSensorById(@PathVariable Long id) {
    return sensorRespository
        .findById(id)
        .orElseThrow(() -> new SensorNotFoundException(id));
  }

  @GetMapping("/api/sensor/user/{id}")
  List<Sensor> getSensorByUserId(@PathVariable Long id) {
    return sensorRespository.findByUser(id);
  }

  @PostMapping("/api/sensor")
  Sensor newSensor(@RequestBody Sensor newSensor) {
    return sensorRespository.save(newSensor);
  }

  @PutMapping("/api/sensor/{id}")
  Sensor updateSensor(@RequestBody Sensor newSensor, @PathVariable Long id) {
    return sensorRespository.findById(id)
        .map(sensor -> {
          sensor.setPin(newSensor.getPin());
          sensor.setLabel(newSensor.getLabel());
          sensor.setMode(newSensor.getMode());
          return sensorRespository.save(sensor);
        })
        .orElseThrow(() -> new SensorNotFoundException(id));
  }

  @DeleteMapping("/api/sensor/{id}")
  String deleteSensor(@PathVariable Long id) {
    if (!sensorRespository.existsById(id)) {
      throw new SensorNotFoundException(id);
    }
    sensorRespository.deleteById(id);
    return "User with id " + id + " has been deleted success.";
  }
}
