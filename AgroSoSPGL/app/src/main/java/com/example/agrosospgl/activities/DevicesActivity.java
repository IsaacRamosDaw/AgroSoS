package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.adapters.DevicesAdapter;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.Device;
import com.example.agrosospgl.utils.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DevicesActivity extends AppCompatActivity implements DevicesAdapter.OnDeviceActionListener {

    private RecyclerView rvDevices;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_devices);

        sessionManager = new SessionManager(this);

        rvDevices = findViewById(R.id.rvDevices);
        rvDevices.setLayoutManager(new LinearLayoutManager(this));

        Button btnHome = findViewById(R.id.btnHome);
        Button btnUsers = findViewById(R.id.btnUsers);
        Button btnPlants = findViewById(R.id.btnPlants);
        Button btnAddDevice = findViewById(R.id.btnAddDevice);

        if (!sessionManager.isAdmin()) {
            btnUsers.setVisibility(View.GONE);
        }

        btnHome.setOnClickListener(v -> startActivity(new Intent(this, MainActivity.class)));
        btnUsers.setOnClickListener(v -> startActivity(new Intent(this, UsersActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));
        btnAddDevice.setOnClickListener(v -> showDeviceDialog(null));

        fetchDevices();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (sessionManager != null) fetchDevices();
    }

    private void fetchDevices() {
        ApiService api = ApiClient.getClient().create(ApiService.class);
        Callback<List<Device>> cb = new Callback<List<Device>>() {
            @Override
            public void onResponse(Call<List<Device>> call, Response<List<Device>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    rvDevices.setAdapter(new DevicesAdapter(response.body(), DevicesActivity.this));
                }
            }
            @Override
            public void onFailure(Call<List<Device>> call, Throwable t) {
                Toast.makeText(DevicesActivity.this, "Error al cargar dispositivos", Toast.LENGTH_SHORT).show();
            }
        };

        if (sessionManager.isAdmin()) {
            api.getAllDevices().enqueue(cb);
        } else {
            api.getDevicesByUser(sessionManager.getUserId()).enqueue(cb);
        }
    }

    private void showDeviceDialog(Device existing) {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_edit_device, null);
        EditText etName = dialogView.findViewById(R.id.etDeviceName);
        Spinner spType = dialogView.findViewById(R.id.spDeviceType);
        String[] types = {"FarmBot", "Tractor"};
        spType.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, types));

        boolean isEdit = existing != null;
        if (isEdit) {
            etName.setText(existing.getName());
            spType.setSelection("Tractor".equals(existing.getType()) ? 1 : 0);
        }

        new AlertDialog.Builder(this)
                .setTitle(isEdit ? "Editar dispositivo" : "Añadir dispositivo")
                .setView(dialogView)
                .setPositiveButton(isEdit ? "Guardar" : "Crear", (dialog, which) -> {
                    String name = etName.getText().toString().trim();
                    if (name.isEmpty()) {
                        Toast.makeText(this, "Introduce el nombre del dispositivo", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    String type = spType.getSelectedItem().toString();

                    if (isEdit) {
                        existing.setName(name);
                        existing.setType(type);
                        ApiClient.getClient().create(ApiService.class)
                                .updateDevice(existing.getId(), existing)
                                .enqueue(new Callback<Device>() {
                                    @Override
                                    public void onResponse(Call<Device> call, Response<Device> response) {
                                        Toast.makeText(DevicesActivity.this, "Dispositivo actualizado", Toast.LENGTH_SHORT).show();
                                        fetchDevices();
                                    }
                                    @Override
                                    public void onFailure(Call<Device> call, Throwable t) {
                                        Toast.makeText(DevicesActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                    } else {
                        Device device = new Device();
                        device.setName(name);
                        device.setType(type);
                        device.setUser(sessionManager.getUserId());
                        ApiClient.getClient().create(ApiService.class)
                                .createDevice(device)
                                .enqueue(new Callback<Device>() {
                                    @Override
                                    public void onResponse(Call<Device> call, Response<Device> response) {
                                        Toast.makeText(DevicesActivity.this, "Dispositivo creado", Toast.LENGTH_SHORT).show();
                                        fetchDevices();
                                    }
                                    @Override
                                    public void onFailure(Call<Device> call, Throwable t) {
                                        Toast.makeText(DevicesActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                    }
                })
                .setNegativeButton("Cancelar", null)
                .show();
    }

    @Override
    public void onEdit(Device device) {
        showDeviceDialog(device);
    }

    @Override
    public void onDelete(Device device) {
        new AlertDialog.Builder(this)
                .setTitle("Eliminar dispositivo")
                .setMessage("¿Eliminar " + device.getName() + "?")
                .setPositiveButton("Eliminar", (dialog, which) ->
                        ApiClient.getClient().create(ApiService.class)
                                .deleteDevice(device.getId())
                                .enqueue(new Callback<Void>() {
                                    @Override
                                    public void onResponse(Call<Void> call, Response<Void> response) {
                                        Toast.makeText(DevicesActivity.this, "Dispositivo eliminado", Toast.LENGTH_SHORT).show();
                                        fetchDevices();
                                    }
                                    @Override
                                    public void onFailure(Call<Void> call, Throwable t) {
                                        Toast.makeText(DevicesActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                }))
                .setNegativeButton("Cancelar", null)
                .show();
    }

    @Override
    public void onReadings(Device device) {
        Intent intent = new Intent(this, ReadingsActivity.class);
        intent.putExtra("deviceId", device.getId());
        intent.putExtra("deviceName", device.getName());
        startActivity(intent);
    }
}
