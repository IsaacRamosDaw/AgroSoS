package com.agroSoSProyect.Exception.Sensor;

public class SensorNotFoundException extends RuntimeException {
  public SensorNotFoundException(Long id) {
    super("Could not found a sensor with id " + id);
  }
}