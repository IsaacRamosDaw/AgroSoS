package com.agroSoSProyect.Exception.Sensor;

public class SensorNotFoundException extends RuntimeException {
  public SensorNotFoundException(Long id) { super("Could not found the user with id "+ id); }
}