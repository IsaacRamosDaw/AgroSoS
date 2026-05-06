package com.example.agrosospgl.models;

public class Device {
    private int id;
    private String name;
    private int user;
    private String type;

    public int getId() { return id; }
    public String getName() { return name; }
    public int getUser() { return user; }
    public String getType() { return type; }

    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setUser(int user) { this.user = user; }
}
