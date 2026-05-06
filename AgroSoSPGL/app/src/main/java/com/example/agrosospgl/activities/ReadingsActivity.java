package com.example.agrosospgl.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.adapters.ReadingsAdapter;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.Reading;
import com.example.agrosospgl.models.Sensor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReadingsActivity extends AppCompatActivity {

    private int deviceId;
    private String deviceName;
    private RecyclerView rvReadings;
    private Button btnToggleHistory;
    private boolean historyVisible = false;
    private final Map<Integer, String> sensorLabels = new HashMap<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_readings);

        deviceId = getIntent().getIntExtra("deviceId", -1);
        deviceName = getIntent().getStringExtra("deviceName");

        TextView tvDeviceTitle = findViewById(R.id.tvDeviceTitle);
        tvDeviceTitle.setText("Lecturas — " + deviceName);

        rvReadings = findViewById(R.id.rvReadings);
        rvReadings.setLayoutManager(new LinearLayoutManager(this));

        btnToggleHistory = findViewById(R.id.btnToggleHistory);

        loadSensors();

        findViewById(R.id.btnStartGenerator).setOnClickListener(v -> startGenerator());
        findViewById(R.id.btnStopGenerator).setOnClickListener(v -> stopGenerator());
        findViewById(R.id.btnTriggerReading).setOnClickListener(v -> triggerReading());
        findViewById(R.id.btnClearReadings).setOnClickListener(v -> confirmClearReadings());
        btnToggleHistory.setOnClickListener(v -> toggleHistory());
        findViewById(R.id.btnBack).setOnClickListener(v -> finish());
    }

    private void loadSensors() {
        ApiClient.getClient().create(ApiService.class).getSensorsByDevice(deviceId)
                .enqueue(new Callback<List<Sensor>>() {
                    @Override
                    public void onResponse(Call<List<Sensor>> call, Response<List<Sensor>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            for (Sensor s : response.body()) {
                                sensorLabels.put(s.getId(), s.getLabel());
                            }
                        }
                    }
                    @Override
                    public void onFailure(Call<List<Sensor>> call, Throwable t) { }
                });
    }

    private void showReadingDetail(List<Reading> group) {
        String raw = group.get(0).getCreatedAt();
        String fecha = "Sin fecha";
        if (raw != null && raw.contains("T")) {
            String[] parts = raw.split("T");
            String[] d = parts[0].split("-");
            String time = parts[1].length() >= 5 ? parts[1].substring(0, 5) : parts[1];
            fecha = d[2] + "/" + d[1] + "/" + d[0] + "  " + time;
        }

        StringBuilder sb = new StringBuilder();
        for (Reading r : group) {
            String label = sensorLabels.get(r.getSensor());
            if (label == null) label = "Sensor " + r.getSensor();
            sb.append(label).append(": ").append(r.getValue()).append("\n");
        }

        new AlertDialog.Builder(this)
                .setTitle(fecha)
                .setMessage(sb.toString().trim())
                .setPositiveButton("Cerrar", null)
                .show();
    }

    private void startGenerator() {
        ApiClient.getClient().create(ApiService.class).startGenerator()
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        Toast.makeText(ReadingsActivity.this,
                                response.isSuccessful() ? "Sensor iniciado" : "Error al iniciar",
                                Toast.LENGTH_SHORT).show();
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(ReadingsActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void stopGenerator() {
        ApiClient.getClient().create(ApiService.class).stopGenerator()
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        Toast.makeText(ReadingsActivity.this,
                                response.isSuccessful() ? "Sensor detenido" : "Error al detener",
                                Toast.LENGTH_SHORT).show();
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(ReadingsActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void triggerReading() {
        ApiClient.getClient().create(ApiService.class).triggerReading(deviceId)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        Toast.makeText(ReadingsActivity.this,
                                response.isSuccessful() ? "Lectura tomada" : "Error al tomar lectura",
                                Toast.LENGTH_SHORT).show();
                        if (historyVisible) loadReadings();
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(ReadingsActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void confirmClearReadings() {
        new AlertDialog.Builder(this)
                .setTitle("Limpiar lecturas")
                .setMessage("¿Eliminar todas las lecturas de este dispositivo?")
                .setPositiveButton("Eliminar", (dialog, which) -> clearReadings())
                .setNegativeButton("Cancelar", null)
                .show();
    }

    private void clearReadings() {
        ApiClient.getClient().create(ApiService.class).clearReadings(deviceId)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        Toast.makeText(ReadingsActivity.this, "Lecturas eliminadas", Toast.LENGTH_SHORT).show();
                        if (historyVisible) loadReadings();
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(ReadingsActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void toggleHistory() {
        historyVisible = !historyVisible;
        if (historyVisible) {
            rvReadings.setVisibility(View.VISIBLE);
            btnToggleHistory.setText("Ocultar historial");
            loadReadings();
        } else {
            rvReadings.setVisibility(View.GONE);
            btnToggleHistory.setText("Ver historial de lecturas");
        }
    }

    private void loadReadings() {
        ApiClient.getClient().create(ApiService.class).getReadingsByDevice(deviceId)
                .enqueue(new Callback<List<Reading>>() {
                    @Override
                    public void onResponse(Call<List<Reading>> call, Response<List<Reading>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            LinkedHashMap<String, List<Reading>> grouped = new LinkedHashMap<>();
                            for (Reading r : response.body()) {
                                String key = r.getCreatedAt() != null ? r.getCreatedAt() : "Sin fecha";
                                if (!grouped.containsKey(key)) grouped.put(key, new ArrayList<>());
                                grouped.get(key).add(r);
                            }
                            List<List<Reading>> groups = new ArrayList<>(grouped.values());
                            rvReadings.setAdapter(new ReadingsAdapter(groups, group -> showReadingDetail(group)));
                        }
                    }
                    @Override
                    public void onFailure(Call<List<Reading>> call, Throwable t) {
                        Toast.makeText(ReadingsActivity.this, "Error al cargar lecturas", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
