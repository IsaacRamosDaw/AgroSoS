package com.example.agrosospgl.api;

import com.example.agrosospgl.models.AuthResponse;
import com.example.agrosospgl.models.Device;
import com.example.agrosospgl.models.Plant;
import com.example.agrosospgl.models.Reading;
import com.example.agrosospgl.models.Sensor;
import com.example.agrosospgl.models.User;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {

    // AUTH
    @POST("auth/login")
    Call<AuthResponse> login(@Body User user);

    @POST("auth/register")
    Call<AuthResponse> register(@Body User user);

    @PUT("auth/update/{id}")
    Call<AuthResponse> updateUser(@Path("id") int id, @Body User user);

    @POST("auth/promote")
    Call<AuthResponse> promoteUser(@Body Map<String, Long> body);

    @POST("auth/revoke")
    Call<AuthResponse> revokeUser(@Body Map<String, Long> body);

    // USERS
    @GET("api/allUser")
    Call<List<User>> getAllUsers();

    @GET("api/user/{id}")
    Call<User> getUserById(@Path("id") int id);

    @DELETE("api/user/{id}")
    Call<Void> deleteUser(@Path("id") int id);

    // PLANTS
    @GET("api/plant")
    Call<List<Plant>> getAllPlants();

    @GET("api/plant/{id}")
    Call<Plant> getPlantById(@Path("id") int id);

    @POST("api/plant")
    Call<Plant> createPlant(@Body Plant plant);

    @PUT("api/plant/{id}")
    Call<Plant> updatePlant(@Path("id") int id, @Body Plant plant);

    @DELETE("api/plant/{id}")
    Call<Void> deletePlant(@Path("id") int id);

    // DEVICES
    @GET("api/device")
    Call<List<Device>> getAllDevices();

    @GET("api/device/{id}")
    Call<Device> getDeviceById(@Path("id") int id);

    @GET("api/device/user/{userId}")
    Call<List<Device>> getDevicesByUser(@Path("userId") int userId);

    @POST("api/device")
    Call<Device> createDevice(@Body Device device);

    @PUT("api/device/{id}")
    Call<Device> updateDevice(@Path("id") int id, @Body Device device);

    @DELETE("api/device/{id}")
    Call<Void> deleteDevice(@Path("id") int id);

    // SENSORS
    @GET("api/sensor/device/{deviceId}")
    Call<List<Sensor>> getSensorsByDevice(@Path("deviceId") int deviceId);

    // READINGS
    @GET("api/reading/device/{deviceId}")
    Call<List<Reading>> getReadingsByDevice(@Path("deviceId") int deviceId);

    // GENERATOR
    @POST("api/generator/start")
    Call<Void> startGenerator();

    @POST("api/generator/stop")
    Call<Void> stopGenerator();

    @POST("api/generator/trigger/{deviceId}")
    Call<Void> triggerReading(@Path("deviceId") int deviceId);

    @DELETE("api/generator/clear/{deviceId}")
    Call<Void> clearReadings(@Path("deviceId") int deviceId);
}
