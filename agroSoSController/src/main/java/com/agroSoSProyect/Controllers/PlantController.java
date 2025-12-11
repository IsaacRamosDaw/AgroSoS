package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Exception.Plant.PlantNotFoundException;
import com.agroSoSProyect.Models.Plant;
import com.agroSoSProyect.Repository.PlantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class PlantController {

  @Autowired
  private PlantRepository plantRepository;

  @GetMapping("/api/plant")
  List<Plant> getAllPlants() {
    return plantRepository.findAll();
  }

  @GetMapping("/api/plant/{id}")
  Plant getPlantById(@PathVariable Long id) {
    return plantRepository.findById(id)
        .orElseThrow(() -> new PlantNotFoundException(id));
  }

  @PostMapping("/api/plant")
  Plant newPlant(@RequestBody Plant newPlant) {
    return plantRepository.save(newPlant);
  }

  @PutMapping("/api/plant/{id}")
  Plant updatePlant(@RequestBody Plant newPlant, @PathVariable Long id) {
    return plantRepository.findById(id)
        .map(plant -> {
          plant.setName(newPlant.getName());
          plant.setX(newPlant.getX());
          plant.setY(newPlant.getY());
          plant.setZ(newPlant.getZ());
          // CreatedAt and UpdatedAt are handled by @PrePersist and @PreUpdate in Model
          return plantRepository.save(plant);
        })
        .orElseThrow(() -> new PlantNotFoundException(id));
  }

  @DeleteMapping("/api/plant/{id}")
  String deletePlant(@PathVariable Long id) {
    if (!plantRepository.existsById(id)) {
      throw new PlantNotFoundException(id);
    }
    plantRepository.deleteById(id);
    return "Plant with id " + id + " has been deleted success.";
  }
}
