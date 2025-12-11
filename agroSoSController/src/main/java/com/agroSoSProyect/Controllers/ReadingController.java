package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Reading.ReadingNotFoundException;
import com.agroSoSProyect.Models.Readings;
import com.agroSoSProyect.Repository.ReadingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class ReadingController {

  @Autowired
  private ReadingRepository readingRepository;

  @GetMapping("/api/reading/")
  List<Readings> getAllReadings() {
    return readingRepository.findAll();
  }

  @GetMapping("/api/reading/{id}")
  Readings getReadingById(@PathVariable Long id) {
    return readingRepository.findById(id)
        .orElseThrow(() -> new ReadingNotFoundException(id));
  }

  @GetMapping("/api/reading/plant/{plantId}")
  List<Readings> getReadingByPlantId(@PathVariable Long plantId) {
    return readingRepository.findByPlant(plantId);
  }

  @GetMapping("/api/reading/sensor/{sensorId}")
  List<Readings> getReadingBySensorId(@PathVariable Long sensorId) {
    return readingRepository.findBySensor(sensorId);
  }

  @PostMapping("/api/reading")
  Readings newReading(@RequestBody Readings newReading) {
    return readingRepository.save(newReading);
  }

  @DeleteMapping("/api/reading/{id}")
  String deleteReading(@PathVariable Long id) {
    if (!readingRepository.existsById(id)) {
      throw new ReadingNotFoundException(id);
    }
    readingRepository.deleteById(id);
    return "Reading with id " + id + " has been deleted success.";
  }

  @GetMapping("/api/reading/device/{deviceId}")
  List<Readings> getReadingByDeviceId(@PathVariable Long deviceId) {
    return readingRepository.findByDevice(deviceId);
  }
}
