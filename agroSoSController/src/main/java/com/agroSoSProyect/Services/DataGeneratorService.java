package com.agroSoSProyect.Services;

import com.agroSoSProyect.Models.Device;
import com.agroSoSProyect.Models.DeviceType;
import com.agroSoSProyect.Models.Readings;
import com.agroSoSProyect.Models.Sensor;
import com.agroSoSProyect.Repository.DeviceRepository;
import com.agroSoSProyect.Repository.ReadingRepository;
import com.agroSoSProyect.Repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class DataGeneratorService {

    @Autowired private DeviceRepository deviceRepository;
    @Autowired private SensorRepository sensorRepository;
    @Autowired private ReadingRepository readingRepository;

    private volatile boolean running = false;

    public void setRunning(boolean running) { this.running = running; }
    public boolean isRunning() { return running; }

    private static final String[][] FARMBOT_SENSORS = {
        {"1", "Temperatura", "1"},
        {"2", "Humedad", "1"},
        {"3", "Humedad Suelo", "1"},
        {"4", "pH", "1"}
    };

    private static final String[][] TRACTOR_SENSORS = {
        {"1", "Temp. Motor", "1"},
        {"2", "RPM", "1"},
        {"3", "Combustible", "1"},
        {"4", "Voltaje Batería", "1"}
    };

    public String seedForUser(Long userId) {
        List<Device> existing = deviceRepository.findByUser(userId);
        long fbCount = existing.stream().filter(d -> d.getType() == DeviceType.FarmBot).count();
        long trCount = existing.stream().filter(d -> d.getType() == DeviceType.Tractor).count();
        int created = 0;

        for (long i = fbCount; i < 2; i++) {
            Device fb = new Device();
            fb.setUser(userId);
            fb.setName(String.valueOf(i + 1));
            fb.setType(DeviceType.FarmBot);
            fb = deviceRepository.save(fb);
            createSensors(fb.getId(), FARMBOT_SENSORS);
            created++;
        }

        for (long i = trCount; i < 1; i++) {
            Device tr = new Device();
            tr.setUser(userId);
            tr.setName(String.valueOf(i + 1));
            tr.setType(DeviceType.Tractor);
            tr = deviceRepository.save(tr);
            createSensors(tr.getId(), TRACTOR_SENSORS);
            created++;
        }

        return created > 0
            ? created + " dispositivo(s) creado(s) correctamente"
            : "Ya existían todos los dispositivos para este usuario";
    }

    public void createDefaultSensorsForDevice(Long deviceId, DeviceType type) {
        String[][] defs = type == DeviceType.FarmBot ? FARMBOT_SENSORS : TRACTOR_SENSORS;
        createSensors(deviceId, defs);
    }

    private void createSensors(Long deviceId, String[][] defs) {
        for (String[] def : defs) {
            Sensor s = new Sensor();
            s.setPin(Integer.parseInt(def[0]));
            s.setLabel(def[1]);
            s.setDevice(deviceId);
            s.setMode(Integer.parseInt(def[2]));
            sensorRepository.save(s);
        }
    }

    @Scheduled(fixedRate = 30000)
    public void generateReadings() {
        if (!running) return;
        sensorRepository.findAll().forEach(this::saveReading);
    }

    public void generateReadingsForDevice(Long deviceId) {
        sensorRepository.findByDevice(deviceId).forEach(this::saveReading);
    }

    private void saveReading(Sensor sensor) {
        Readings reading = new Readings();
        reading.setMode(sensor.getMode());
        reading.setPin(sensor.getPin());
        reading.setValue(generateValue(sensor.getLabel()));
        reading.setX(0);
        reading.setY(0);
        reading.setZ(0);
        reading.setDevice(sensor.getDevice());
        reading.setSensor(sensor.getId());
        readingRepository.save(reading);
    }

    private String generateValue(String label) {
        ThreadLocalRandom r = ThreadLocalRandom.current();
        String l = label.toLowerCase();
        if (l.contains("suelo") || l.contains("soil") || l.contains("moisture")) return String.format("%.1f", r.nextDouble(20, 80));
        if (l.contains("temp"))    return String.format("%.1f", r.nextDouble(15, 45));
        if (l.contains("humid") || l.contains("humed")) return String.format("%.1f", r.nextDouble(30, 90));
        if (l.contains("ph"))      return String.format("%.1f", r.nextDouble(5.5, 8.0));
        if (l.contains("rpm"))     return String.valueOf(r.nextInt(600, 3000));
        if (l.contains("fuel") || l.contains("combustible")) return String.format("%.1f", r.nextDouble(10, 100));
        if (l.contains("battery") || l.contains("voltage") || l.contains("voltaje")) return String.format("%.1f", r.nextDouble(11.5, 14.5));
        return String.format("%.1f", r.nextDouble(0, 100));
    }
}
