package com.example.agrosospgl.models;

import java.util.List;

public class AuthResponse {
    private boolean success;
    private String message;
    private User user;
    private List<Device> device;

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public User getUser() { return user; }
    public List<Device> getDevice() { return device; }
}
