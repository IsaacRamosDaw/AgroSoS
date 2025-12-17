package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

import com.example.agrosospgl.R;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnUsers = findViewById(R.id.btnUsers);
        Button btnPlants = findViewById(R.id.btnPlants);
        Button btnDevices = findViewById(R.id.btnDevices);

        btnUsers.setOnClickListener(v -> startActivity(new Intent(this, UsersActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));
        btnDevices.setOnClickListener(v -> startActivity(new Intent(this, DevicesActivity.class)));
    }
}
