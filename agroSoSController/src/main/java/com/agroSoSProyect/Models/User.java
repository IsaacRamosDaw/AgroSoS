package com.agroSoSProyect.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  public User() {}

//  public User(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, String name, String email,
//      String password) {
//    this.id = id;
//    this.createdAt = createdAt;
//    this.updatedAt = updatedAt;
//    this.name = name;
//    this.email = email;
//    this.password = password;
//  }
//
//  public User(LocalDateTime createdAt, LocalDateTime updatedAt, String name, String email, String password) {
//    this.createdAt = createdAt;
//    this.updatedAt = updatedAt;
//    this.name = name;
//    this.email = email;
//    this.password = password;
//  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @PreUpdate
  protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }
}