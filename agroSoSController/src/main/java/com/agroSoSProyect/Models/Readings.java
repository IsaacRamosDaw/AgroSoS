package com.agroSoSProyect.Models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "reading")
public class Readings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reading", nullable = false)
    private Long idReading;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int mode;

    @Column(nullable = false)
    private int pin;

    @Column(nullable = false)
    private String value;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)
    private int y;

    @Column(nullable = false)
    private int z;

    @Column(name = "created_by_user_id", nullable = false)
    private Long createdByUserID;

    public Readings() {
    }

    public Readings(Long idReading, LocalDateTime createdAt, int mode, int pin, String value, int x, int y, int z,
            Long createdByUserID) {
        this.idReading = idReading;
        this.createdAt = createdAt;
        this.mode = mode;
        this.pin = pin;
        this.value = value;
        this.x = x;
        this.y = y;
        this.z = z;
        this.createdByUserID = createdByUserID;
    }

    public Long getIdReading() {
        return idReading;
    }

    public void setIdReading(Long idReading) {
        this.idReading = idReading;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public int getPin() {
        return pin;
    }

    public void setPin(int pin) {
        this.pin = pin;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getZ() {
        return z;
    }

    public void setZ(int z) {
        this.z = z;
    }

    public Long getCreatedByUserID() {
        return createdByUserID;
    }

    public void setCreatedByUserID(Long createdByUserID) {
        this.createdByUserID = createdByUserID;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
