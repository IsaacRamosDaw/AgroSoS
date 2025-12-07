package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Reading.ReadingNotFoundException;
import com.agroSoSProyect.Models.Reading;
import com.agroSoSProyect.Repository.ReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class ReadingController {

  @Autowired
  private ReadingRepository readingRepository;

  @GetMapping("/api/reading")
  List<Reading> getAllReadings() {
    return readingRepository.findAll();
  }

  @GetMapping("/api/reading/{id}")
  Reading getReadingById(@PathVariable Long id) {
    return readingRepository.findById(id)
        .orElseThrow(() -> new ReadingNotFoundException(id));
  }

  @GetMapping("/api/reading/plant/{plantId}")
  List<Reading> getReadingByPlantId(@PathVariable Long plantId) {
    return readingRepository.findByPlant(plantId);
  }

  @GetMapping("/api/reading/sensor/{sensorId}")
  List<Reading> getReadingBySensorId(@PathVariable Long sensorId) {
    return readingRepository.findBySensor(sensorId);
  }

  @PostMapping("/api/reading")
  Reading newReading(@RequestBody Reading newReading) {
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
}
