package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SensorRespository extends JpaRepository<Sensor, Long> {}