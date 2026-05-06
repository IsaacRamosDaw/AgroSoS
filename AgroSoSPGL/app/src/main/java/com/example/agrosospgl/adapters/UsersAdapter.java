package com.example.agrosospgl.adapters;

import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.models.User;

import java.util.List;

public class UsersAdapter extends RecyclerView.Adapter<UsersAdapter.UserViewHolder> {

    public interface OnUserActionListener {
        void onEdit(User user);
        void onDelete(User user);
        void onPromote(User user);
        void onRevoke(User user);
    }

    private final List<User> userList;
    private final OnUserActionListener listener;

    public UsersAdapter(List<User> userList, OnUserActionListener listener) {
        this.userList = userList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.recycler_item_user, parent, false);
        return new UserViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull UserViewHolder holder, int position) {
        User user = userList.get(position);
        holder.tvName.setText(user.getName());
        holder.tvEmail.setText(user.getEmail());
        holder.tvRole.setText("Rol: " + user.getRole());

        holder.itemView.setOnLongClickListener(v -> {
            boolean isAdmin = "ADMIN".equals(user.getRole());
            String roleAction = isAdmin ? "Revocar Admin" : "Promover a Admin";
            new AlertDialog.Builder(v.getContext())
                    .setTitle(user.getName())
                    .setItems(new String[]{"Editar", "Eliminar", roleAction}, (dialog, which) -> {
                        switch (which) {
                            case 0: listener.onEdit(user); break;
                            case 1: listener.onDelete(user); break;
                            case 2:
                                if (isAdmin) listener.onRevoke(user);
                                else listener.onPromote(user);
                                break;
                        }
                    })
                    .show();
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return userList.size();
    }

    static class UserViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvEmail, tvRole;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvUserName);
            tvEmail = itemView.findViewById(R.id.tvUserEmail);
            tvRole = itemView.findViewById(R.id.tvUserRole);
        }
    }
}
