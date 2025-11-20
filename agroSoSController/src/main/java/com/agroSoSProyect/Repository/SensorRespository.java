package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Sensor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SensorRespository extends JpaRepository<Sensor, Long> {
  List<Sensor> findByUser(Long id);
}