package com.agroSoSProyect.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.persistence.PrePersist;

@Entity
@Table(name = "readings")
public class Reading {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long plant;

  private Long sensor;

  private LocalDateTime createdAt;

  private Integer ping;

  private String value;

  private Integer x;

  private Integer y;

  private Integer z;

  private Integer mode;

  private Integer pin;

  public Reading() {
  }

  public Reading(Long plant, Long sensor, LocalDateTime createdAt, Integer ping, String value, Integer x, Integer y,
      Integer z, Integer mode, Integer pin) {
    this.plant = plant;
    this.sensor = sensor;
    this.createdAt = createdAt;
    this.ping = ping;
    this.value = value;
    this.x = x;
    this.y = y;
    this.z = z;
    this.mode = mode;
    this.pin = pin;
  }

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getPlant() {
    return plant;
  }

  public void setPlant(Long plant) {
    this.plant = plant;
  }

  public Long getSensor() {
    return sensor;
  }

  public void setSensor(Long sensor) {
    this.sensor = sensor;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public Integer getPing() {
    return ping;
  }

  public void setPing(Integer ping) {
    this.ping = ping;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public Integer getX() {
    return x;
  }

  public void setX(Integer x) {
    this.x = x;
  }

  public Integer getY() {
    return y;
  }

  public void setY(Integer y) {
    this.y = y;
  }

  public Integer getZ() {
    return z;
  }

  public void setZ(Integer z) {
    this.z = z;
  }

  public Integer getMode() {
    return mode;
  }

  public void setMode(Integer mode) {
    this.mode = mode;
  }

  public Integer getPin() {
    return pin;
  }

  public void setPin(Integer pin) {
    this.pin = pin;
  }
}
