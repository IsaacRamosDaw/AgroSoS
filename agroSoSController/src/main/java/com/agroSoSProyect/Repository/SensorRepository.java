package com.agroSoSProyect.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.agroSoSProyect.Models.Sensor;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
  List<Sensor> findByDevice(Long deviceId);

  @Modifying
  @Transactional
  void deleteByDevice(Long deviceId);
}
