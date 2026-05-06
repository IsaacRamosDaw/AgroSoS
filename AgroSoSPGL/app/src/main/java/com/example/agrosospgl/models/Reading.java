package com.example.agrosospgl.models;

public class Reading {
    private int id;
    private String createdAt;
    private int mode;
    private int pin;
    private String value;
    private int x;
    private int y;
    private int z;
    private int device;
    private int sensor;

    public int getId() { return id; }
    public String getCreatedAt() { return createdAt; }
    public int getMode() { return mode; }
    public int getPin() { return pin; }
    public String getValue() { return value; }
    public int getX() { return x; }
    public int getY() { return y; }
    public int getZ() { return z; }
    public int getDevice() { return device; }
    public int getSensor() { return sensor; }
}
