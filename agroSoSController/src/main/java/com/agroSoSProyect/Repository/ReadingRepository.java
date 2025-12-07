package com.agroSoSProyect.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agroSoSProyect.Models.Readings;

import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<Readings, Long> {
  List<Readings> findByPlant(Long plantId);

  List<Readings> findBySensor(Long sensorId);
}
