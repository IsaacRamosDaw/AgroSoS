package com.agroSoSProyect.Exception.Device;

public class DeviceNotFoundException extends RuntimeException {
  public DeviceNotFoundException(Long id) {
    super("Could not find device with id " + id);
  }
}
