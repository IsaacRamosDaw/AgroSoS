package com.example.agrosospgl.api;

import com.example.agrosospgl.models.User;
import com.example.agrosospgl.models.Plant;
import com.example.agrosospgl.models.Device;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {

    // USER
    @GET("api/allUser")
    Call<List<User>> getAllUsers();

    @GET("api/user/{id}")
    Call<User> getUserById(@Path("id") int id);

    @POST("auth/register")
    Call<User> createUser(@Body User user);

    @PUT("auth/update/{id}")
    Call<User> updateUser(@Path("id") int id, @Body User user);

    @DELETE("api/user/{id}")
    Call<Void> deleteUser(@Path("id") int id);

    //PLANTS
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

    //DEVICES
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
}
