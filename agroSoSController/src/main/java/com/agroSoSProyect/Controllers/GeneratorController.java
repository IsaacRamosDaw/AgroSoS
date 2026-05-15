package com.agroSoSProyect.Controllers;

import com.agroSoSProyect.Repository.ReadingRepository;
import com.agroSoSProyect.Services.DataGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("http://localhost:5173")
public class GeneratorController {

    @Autowired private DataGeneratorService generatorService;
    @Autowired private ReadingRepository readingRepository;

    @PostMapping("/api/generator/seed/{userId}")
    public Map<String, String> seed(@PathVariable Long userId) {
        return Map.of("message", generatorService.seedForUser(userId));
    }

    @PostMapping("/api/generator/start")
    public Map<String, Object> start() {
        generatorService.setRunning(true);
        return Map.of("running", true);
    }

    @PostMapping("/api/generator/stop")
    public Map<String, Object> stop() {
        generatorService.setRunning(false);
        return Map.of("running", false);
    }

    @GetMapping("/api/generator/status")
    public Map<String, Object> status() {
        return Map.of("running", generatorService.isRunning());
    }

    @PostMapping("/api/generator/trigger/{deviceId}")
    public Map<String, String> trigger(@PathVariable Long deviceId) {
        generatorService.generateReadingsForDevice(deviceId, null);
        return Map.of("message", "Lectura generada correctamente");
    }

    @PostMapping("/api/generator/trigger/{deviceId}/{plantId}")
    public Map<String, String> trigger(@PathVariable Long deviceId, @PathVariable Long plantId) {
        generatorService.generateReadingsForDevice(deviceId, plantId);
        return Map.of("message", "Lectura generada correctamente");
    }

    @DeleteMapping("/api/generator/clear/{deviceId}")
    public Map<String, String> clear(@PathVariable Long deviceId) {
        readingRepository.deleteByDevice(deviceId);
        return Map.of("message", "Lecturas eliminadas correctamente");
    }
}
