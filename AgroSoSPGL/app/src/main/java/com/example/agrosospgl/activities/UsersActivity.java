package com.example.agrosospgl.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.adapters.UsersAdapter;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.User;

import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UsersActivity extends AppCompatActivity {

    private RecyclerView rvUsers;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_users);

        rvUsers = findViewById(R.id.rvUsers);
        rvUsers.setLayoutManager(new LinearLayoutManager(this));

        Button btnHome = findViewById(R.id.btnHome);
        Button btnPlants = findViewById(R.id.btnPlants);
        Button btnDevices = findViewById(R.id.btnDevices);

        btnHome.setOnClickListener(v -> startActivity(new Intent(this, MainActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));
        btnDevices.setOnClickListener(v -> startActivity(new Intent(this, DevicesActivity.class)));

        fetchUsers();
    }

    private void fetchUsers() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        Call<List<User>> call = apiService.getAllUsers();

        call.enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<User> users = response.body();
                    UsersAdapter adapter = new UsersAdapter(users);
                    rvUsers.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                // Optional: show Toast or log error
            }
        });
    }
}
