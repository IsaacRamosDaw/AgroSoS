package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.agrosospgl.R;
import com.example.agrosospgl.utils.SessionManager;

public class MainActivity extends AppCompatActivity {

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);
        if (!sessionManager.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_main);

        TextView tvWelcome = findViewById(R.id.tvWelcome);
        Button btnUsers = findViewById(R.id.btnUsers);
        Button btnPlants = findViewById(R.id.btnPlants);
        Button btnDevices = findViewById(R.id.btnDevices);
        Button btnLogout = findViewById(R.id.btnLogout);

        tvWelcome.setText("Bienvenido/a, " + sessionManager.getUserName());

        if (!sessionManager.isAdmin()) {
            btnUsers.setVisibility(View.GONE);
        }

        btnUsers.setOnClickListener(v -> startActivity(new Intent(this, UsersActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));
        btnDevices.setOnClickListener(v -> startActivity(new Intent(this, DevicesActivity.class)));
        btnLogout.setOnClickListener(v -> {
            sessionManager.clearSession();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }
}
