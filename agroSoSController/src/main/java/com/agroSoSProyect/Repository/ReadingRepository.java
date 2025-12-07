package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Long> {
  List<Reading> findByPlant(Long plantId);

  List<Reading> findBySensor(Long sensorId);
}
