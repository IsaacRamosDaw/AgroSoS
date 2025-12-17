package com.example.agrosospgl.adapters;

import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.agrosospgl.R;
import com.example.agrosospgl.activities.PlantsActivity;
import com.example.agrosospgl.models.Plant;
import java.util.List;

public class PlantsAdapter extends RecyclerView.Adapter<PlantsAdapter.PlantViewHolder> {

    private List<Plant> plantList;
    private PlantsActivity activity;

    public PlantsAdapter(List<Plant> plantList, PlantsActivity activity) {
        this.plantList = plantList;
        this.activity = activity;
    }

    @NonNull
    @Override
    public PlantViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.recycler_item_plant, parent, false);
        return new PlantViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PlantViewHolder holder, int position) {
        Plant plant = plantList.get(position);

        holder.tvName.setText(plant.getName());
        holder.tvCoordinates.setText("x: " + plant.getX() + ", y: " + plant.getY() + ", z: " + plant.getZ());
        holder.tvCreatedAt.setText("Created: " + plant.getCreatedAt());

        // TIENES QUE MANTENER PULSADO PARA EDITAR
        holder.itemView.setOnLongClickListener(v -> {
            showEditDeleteDialog(plant);
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return plantList.size();
    }

    private void showEditDeleteDialog(Plant plant) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Edit or Delete Plant");

        View view = LayoutInflater.from(activity).inflate(R.layout.dialog_edit_plant, null);
        EditText etName = view.findViewById(R.id.etPlantName);
        EditText etX = view.findViewById(R.id.etPlantX);
        EditText etY = view.findViewById(R.id.etPlantY);
        EditText etZ = view.findViewById(R.id.etPlantZ);

        etName.setText(plant.getName());
        etX.setText(String.valueOf(plant.getX()));
        etY.setText(String.valueOf(plant.getY()));
        etZ.setText(String.valueOf(plant.getZ()));

        builder.setView(view);

        builder.setPositiveButton("Save", (dialog, which) -> {
            plant.setName(etName.getText().toString());
            plant.setX(Integer.parseInt(etX.getText().toString()));
            plant.setY(Integer.parseInt(etY.getText().toString()));
            plant.setZ(Integer.parseInt(etZ.getText().toString()));
            activity.updatePlant(plant);
        });

        builder.setNegativeButton("Delete", (dialog, which) -> activity.deletePlant(plant.getId()));

        builder.setNeutralButton("Cancel", (dialog, which) -> dialog.dismiss());

        builder.show();
    }

    static class PlantViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvCoordinates, tvCreatedAt;

        public PlantViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvPlantName);
            tvCoordinates = itemView.findViewById(R.id.tvPlantCoordinates);
            tvCreatedAt = itemView.findViewById(R.id.tvPlantCreatedAt);
        }
    }
}
