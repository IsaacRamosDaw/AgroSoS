package com.example.agrosospgl.adapters;

import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.models.Device;

import java.util.List;

public class DevicesAdapter extends RecyclerView.Adapter<DevicesAdapter.DeviceViewHolder> {

    public interface OnDeviceActionListener {
        void onEdit(Device device);
        void onDelete(Device device);
        void onReadings(Device device);
    }

    private final List<Device> deviceList;
    private final OnDeviceActionListener listener;

    public DevicesAdapter(List<Device> deviceList, OnDeviceActionListener listener) {
        this.deviceList = deviceList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public DeviceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.recycler_item_device, parent, false);
        return new DeviceViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DeviceViewHolder holder, int position) {
        Device device = deviceList.get(position);
        holder.tvName.setText(device.getName());
        holder.tvType.setText("Tipo: " + device.getType());
        holder.tvUser.setText("ID Usuario: " + device.getUser());

        holder.btnReadings.setOnClickListener(v -> listener.onReadings(device));

        holder.itemView.setOnLongClickListener(v -> {
            new AlertDialog.Builder(v.getContext())
                    .setTitle(device.getName())
                    .setItems(new String[]{"Editar", "Eliminar"}, (dialog, which) -> {
                        if (which == 0) listener.onEdit(device);
                        else listener.onDelete(device);
                    })
                    .show();
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return deviceList.size();
    }

    static class DeviceViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvType, tvUser;
        Button btnReadings;

        public DeviceViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvDeviceName);
            tvType = itemView.findViewById(R.id.tvDeviceType);
            tvUser = itemView.findViewById(R.id.tvDeviceUser);
            btnReadings = itemView.findViewById(R.id.btnReadings);
        }
    }
}
