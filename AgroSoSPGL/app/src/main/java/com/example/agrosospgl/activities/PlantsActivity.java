package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.adapters.PlantsAdapter;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.Plant;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PlantsActivity extends AppCompatActivity {

    private RecyclerView rvPlants;
    private PlantsAdapter adapter;
    private List<Plant> plants;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_plants);

        rvPlants = findViewById(R.id.rvPlants);
        rvPlants.setLayoutManager(new LinearLayoutManager(this));

        Button btnHome = findViewById(R.id.btnHome);
        Button btnUsers = findViewById(R.id.btnUsers);
        Button btnDevices = findViewById(R.id.btnDevices);
        Button btnCreate = findViewById(R.id.btnCreatePlant);

        btnHome.setOnClickListener(v -> startActivity(new Intent(this, MainActivity.class)));
        btnUsers.setOnClickListener(v -> startActivity(new Intent(this, UsersActivity.class)));
        btnDevices.setOnClickListener(v -> startActivity(new Intent(this, DevicesActivity.class)));
        btnCreate.setOnClickListener(v -> showCreatePlantDialog());

        fetchPlants();
    }

    private void fetchPlants() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.getAllPlants().enqueue(new Callback<List<Plant>>() {
            @Override
            public void onResponse(Call<List<Plant>> call, Response<List<Plant>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    plants = response.body();
                    adapter = new PlantsAdapter(plants, PlantsActivity.this);
                    rvPlants.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<List<Plant>> call, Throwable t) {
                Toast.makeText(PlantsActivity.this, "Error fetching plants: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showCreatePlantDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_edit_plant, null);

        EditText etName = dialogView.findViewById(R.id.etPlantName);
        EditText etX = dialogView.findViewById(R.id.etPlantX);
        EditText etY = dialogView.findViewById(R.id.etPlantY);
        EditText etZ = dialogView.findViewById(R.id.etPlantZ);

        etName.setText("");
        etX.setText("0");
        etY.setText("0");
        etZ.setText("0");

        new AlertDialog.Builder(this)
                .setTitle("Create New Plant")
                .setView(dialogView)
                .setPositiveButton("Create", (dialog, which) -> {
                    try {
                        Plant plant = new Plant();
                        plant.setName(etName.getText().toString());
                        plant.setX(Integer.parseInt(etX.getText().toString()));
                        plant.setY(Integer.parseInt(etY.getText().toString()));
                        plant.setZ(Integer.parseInt(etZ.getText().toString()));


                        ApiService apiService = ApiClient.getClient().create(ApiService.class);
                        apiService.createPlant(plant).enqueue(new Callback<Plant>() {
                            @Override
                            public void onResponse(Call<Plant> call, Response<Plant> response) {
                                if (response.isSuccessful() && response.body() != null) {
                                    Toast.makeText(PlantsActivity.this, "Plant created!", Toast.LENGTH_SHORT).show();
                                    fetchPlants();
                                } else {
                                    Toast.makeText(PlantsActivity.this,
                                            "Failed to create plant: " + response.code(),
                                            Toast.LENGTH_LONG).show();
                                }
                            }

                            @Override
                            public void onFailure(Call<Plant> call, Throwable t) {
                                Toast.makeText(PlantsActivity.this,
                                        "Error creating plant: " + t.getMessage(),
                                        Toast.LENGTH_LONG).show();
                            }
                        });

                    } catch (NumberFormatException e) {
                        Toast.makeText(PlantsActivity.this, "Invalid coordinates", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss())
                .show();
    }

    public void deletePlant(int id) {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.deletePlant(id).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(PlantsActivity.this, "Plant deleted", Toast.LENGTH_SHORT).show();
                fetchPlants();
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(PlantsActivity.this, "Error deleting plant: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void updatePlant(Plant plant) {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.updatePlant(plant.getId(), plant).enqueue(new Callback<Plant>() {
            @Override
            public void onResponse(Call<Plant> call, Response<Plant> response) {
                Toast.makeText(PlantsActivity.this, "Plant updated", Toast.LENGTH_SHORT).show();
                fetchPlants();
            }

            @Override
            public void onFailure(Call<Plant> call, Throwable t) {
                Toast.makeText(PlantsActivity.this, "Error updating plant: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
