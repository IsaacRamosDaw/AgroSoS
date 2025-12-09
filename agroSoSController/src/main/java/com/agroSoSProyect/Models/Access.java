package com.agroSoSProyect.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "access")
public class Access {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Long id;

  // @Column(nullable = false)
  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "user_id", nullable = false)
  private Long user;

  // @Column(nullable = false)
  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "device_id", nullable = false)
  private Long device;

  public Access() {
  }

  public Access(Long user, Long device) {
    this.user = user;
    this.device = device;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  public Long getDevice() {
    return device;
  }

  public void setDevice(Long device) {
    this.device = device;
  }
}
