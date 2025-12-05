package com.agroSoSProyect.Models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plants")
public class Plants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plant", nullable = false)
    private Long idPlant;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)

    private int y;
    
    @Column(nullable = false)
    private int z;

    public Plants(LocalDateTime createdAt, Long idPlant, String name, LocalDateTime updatedAt, int x, int y, int z) {
        this.createdAt = createdAt;
        this.idPlant = idPlant;
        this.name = name;
        this.updatedAt = updatedAt;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
