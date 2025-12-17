package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.adapters.DevicesAdapter;
import com.example.agrosospgl.R;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.Device;

import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DevicesActivity extends AppCompatActivity {

    private RecyclerView rvDevices;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_devices);

        rvDevices = findViewById(R.id.rvDevices);
        rvDevices.setLayoutManager(new LinearLayoutManager(this));

        Button btnHome = findViewById(R.id.btnHome);
        Button btnUsers = findViewById(R.id.btnUsers);
        Button btnPlants = findViewById(R.id.btnPlants);

        btnHome.setOnClickListener(v -> startActivity(new Intent(this, MainActivity.class)));
        btnUsers.setOnClickListener(v -> startActivity(new Intent(this, UsersActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));

        fetchDevices();
    }

    private void fetchDevices() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        Call<List<Device>> call = apiService.getAllDevices();
        call.enqueue(new Callback<List<Device>>() {
            @Override
            public void onResponse(Call<List<Device>> call, Response<List<Device>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Device> devices = response.body();
                    DevicesAdapter adapter = new DevicesAdapter(devices);
                    rvDevices.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<List<Device>> call, Throwable t) {

            }
        });
    }
}
