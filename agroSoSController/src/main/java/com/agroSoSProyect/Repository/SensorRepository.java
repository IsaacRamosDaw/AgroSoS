package com.agroSoSProyect.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agroSoSProyect.Models.Sensor;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
  List<Sensor> findByUser(Long id);

  List<Sensor> findByDevice(Long deviceId);
  //
  // Los sensores no se van a encontrar por user, sino al DEVICE al que
  // pertenecen.
  // Hay que cambiar esto.
  // Al cambio a lo mejor hay que cambiar cosas dentro de Exception/Sensor
  //
  // ------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!------------------------------
  // //
}