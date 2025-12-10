package com.agroSoSProyect.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agroSoSProyect.Models.Sensor;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
  List<Sensor> findByDevice(Long deviceId);
}