package com.agroSoSProyect.Models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "sensor")
public class Sensor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  //OJO darle Column nombre y nullable = false?
  private Long id;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Column(nullable = false)
  private int pin;

  @Column(nullable = false)
  private String label;

  @Column(nullable = false)
  private int mode;

  @Column(nullable = false)
  private Long user;

  public Sensor() {} // OJO: Se borra esto?

  public Sensor(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, int pin, String label, int mode, Long user) {
    // OJO:Esto puede suponer cambios en Controllers
    this.id = id; //ID del sensor individual
    this.createdAt = createdAt;// SE QUITAN, VAN PARA READINGS
    this.updatedAt = updatedAt;// SE QUITAN, VAN PARA READINGS
    this.pin = pin; 
    this.label = label; // Nombre del sensor -> Dado por el ID. Ej: "BOT-Luz", "Tractor-IntensidadSalidaBateria"2 ???
    this.mode = mode; // Modo del sensor, no se si "Entrada/Salida" o "ANALOGICO/DIGITAL"
    this.user = user; // Sensor va a pertenecer a un DEVICE, no a un USER
    // Faltarían por añadir las relaciones con DEVICE cuando se haga el diagrama
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUser() { return user; }

  public void setUser(Long user){ this.user = user; }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public int getPin() {
    return pin;
  }

  public void setPin(int pin) {
    this.pin = pin;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public int getMode() {
    return mode;
  }

  public void setMode(int mode) {
    this.mode = mode;
  }

  @PreUpdate
  protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }
}

