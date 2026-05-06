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
import com.example.agrosospgl.adapters.UsersAdapter;
import com.example.agrosospgl.api.ApiClient;
import com.example.agrosospgl.api.ApiService;
import com.example.agrosospgl.models.AuthResponse;
import com.example.agrosospgl.models.User;
import com.example.agrosospgl.utils.SessionManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UsersActivity extends AppCompatActivity implements UsersAdapter.OnUserActionListener {

    private RecyclerView rvUsers;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);
        if (!sessionManager.isAdmin()) {
            Toast.makeText(this, "Acceso de administrador requerido", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setContentView(R.layout.activity_users);

        rvUsers = findViewById(R.id.rvUsers);
        rvUsers.setLayoutManager(new LinearLayoutManager(this));

        Button btnHome = findViewById(R.id.btnHome);
        Button btnPlants = findViewById(R.id.btnPlants);
        Button btnDevices = findViewById(R.id.btnDevices);
        Button btnAddUser = findViewById(R.id.btnAddUser);

        btnHome.setOnClickListener(v -> startActivity(new Intent(this, MainActivity.class)));
        btnPlants.setOnClickListener(v -> startActivity(new Intent(this, PlantsActivity.class)));
        btnDevices.setOnClickListener(v -> startActivity(new Intent(this, DevicesActivity.class)));
        btnAddUser.setOnClickListener(v -> showUserDialog(null));

        fetchUsers();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (sessionManager != null) fetchUsers();
    }

    private void fetchUsers() {
        ApiClient.getClient().create(ApiService.class).getAllUsers()
                .enqueue(new Callback<List<User>>() {
                    @Override
                    public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            rvUsers.setAdapter(new UsersAdapter(response.body(), UsersActivity.this));
                        }
                    }
                    @Override
                    public void onFailure(Call<List<User>> call, Throwable t) {
                        Toast.makeText(UsersActivity.this, "Error al cargar usuarios", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void showUserDialog(User existing) {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_edit_user, null);
        EditText etName = dialogView.findViewById(R.id.etUserName);
        EditText etEmail = dialogView.findViewById(R.id.etUserEmail);
        EditText etPassword = dialogView.findViewById(R.id.etUserPassword);

        boolean isEdit = existing != null;
        if (isEdit) {
            etName.setText(existing.getName());
            etEmail.setText(existing.getEmail());
        }

        new AlertDialog.Builder(this)
                .setTitle(isEdit ? "Editar usuario" : "Añadir usuario")
                .setView(dialogView)
                .setPositiveButton(isEdit ? "Guardar" : "Crear", (dialog, which) -> {
                    String name = etName.getText().toString().trim();
                    String email = etEmail.getText().toString().trim();
                    String password = etPassword.getText().toString().trim();

                    if (name.isEmpty() || email.isEmpty() || (!isEdit && password.isEmpty())) {
                        Toast.makeText(this, "Completa todos los campos obligatorios", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    if (!password.isEmpty()) user.setPassword(password);

                    if (isEdit) {
                        ApiClient.getClient().create(ApiService.class)
                                .updateUser(existing.getId(), user)
                                .enqueue(new Callback<AuthResponse>() {
                                    @Override
                                    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                                        String msg = response.body() != null ? response.body().getMessage() : "Actualizado";
                                        Toast.makeText(UsersActivity.this, msg, Toast.LENGTH_SHORT).show();
                                        fetchUsers();
                                    }
                                    @Override
                                    public void onFailure(Call<AuthResponse> call, Throwable t) {
                                        Toast.makeText(UsersActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                    } else {
                        ApiClient.getClient().create(ApiService.class)
                                .register(user)
                                .enqueue(new Callback<AuthResponse>() {
                                    @Override
                                    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                                        String msg = response.body() != null ? response.body().getMessage() : "Creado";
                                        Toast.makeText(UsersActivity.this, msg, Toast.LENGTH_SHORT).show();
                                        fetchUsers();
                                    }
                                    @Override
                                    public void onFailure(Call<AuthResponse> call, Throwable t) {
                                        Toast.makeText(UsersActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                    }
                })
                .setNegativeButton("Cancelar", null)
                .show();
    }

    @Override
    public void onEdit(User user) { showUserDialog(user); }

    @Override
    public void onDelete(User user) {
        new AlertDialog.Builder(this)
                .setTitle("Eliminar usuario")
                .setMessage("¿Eliminar a " + user.getName() + "?")
                .setPositiveButton("Eliminar", (dialog, which) ->
                        ApiClient.getClient().create(ApiService.class)
                                .deleteUser(user.getId())
                                .enqueue(new Callback<Void>() {
                                    @Override
                                    public void onResponse(Call<Void> call, Response<Void> response) {
                                        Toast.makeText(UsersActivity.this, "Usuario eliminado", Toast.LENGTH_SHORT).show();
                                        fetchUsers();
                                    }
                                    @Override
                                    public void onFailure(Call<Void> call, Throwable t) {
                                        Toast.makeText(UsersActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                }))
                .setNegativeButton("Cancelar", null)
                .show();
    }

    @Override
    public void onPromote(User user) {
        Map<String, Long> body = new HashMap<>();
        body.put("requesterId", (long) sessionManager.getUserId());
        body.put("targetUserId", (long) user.getId());
        ApiClient.getClient().create(ApiService.class).promoteUser(body)
                .enqueue(new Callback<AuthResponse>() {
                    @Override
                    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                        String msg = response.body() != null ? response.body().getMessage() : "Promovido";
                        Toast.makeText(UsersActivity.this, msg, Toast.LENGTH_SHORT).show();
                        fetchUsers();
                    }
                    @Override
                    public void onFailure(Call<AuthResponse> call, Throwable t) {
                        Toast.makeText(UsersActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public void onRevoke(User user) {
        Map<String, Long> body = new HashMap<>();
        body.put("requesterId", (long) sessionManager.getUserId());
        body.put("targetUserId", (long) user.getId());
        ApiClient.getClient().create(ApiService.class).revokeUser(body)
                .enqueue(new Callback<AuthResponse>() {
                    @Override
                    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                        String msg = response.body() != null ? response.body().getMessage() : "Revocado";
                        Toast.makeText(UsersActivity.this, msg, Toast.LENGTH_SHORT).show();
                        fetchUsers();
                    }
                    @Override
                    public void onFailure(Call<AuthResponse> call, Throwable t) {
                        Toast.makeText(UsersActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
