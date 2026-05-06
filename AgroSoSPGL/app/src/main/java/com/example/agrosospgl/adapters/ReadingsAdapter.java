package com.example.agrosospgl.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.agrosospgl.R;
import com.example.agrosospgl.models.Reading;

import java.util.List;

public class ReadingsAdapter extends RecyclerView.Adapter<ReadingsAdapter.ReadingViewHolder> {

    public interface OnGroupClickListener {
        void onView(List<Reading> group);
    }

    private final List<List<Reading>> groups;
    private final OnGroupClickListener listener;

    public ReadingsAdapter(List<List<Reading>> groups, OnGroupClickListener listener) {
        this.groups = groups;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ReadingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.recycler_item_reading, parent, false);
        return new ReadingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReadingViewHolder holder, int position) {
        List<Reading> group = groups.get(position);
        String raw = group.get(0).getCreatedAt();

        if (raw != null && raw.contains("T")) {
            String[] parts = raw.split("T");
            String[] d = parts[0].split("-");
            holder.tvReadingDate.setText(d[2] + "/" + d[1] + "/" + d[0]);
            String time = parts[1].length() >= 5 ? parts[1].substring(0, 5) : parts[1];
            holder.tvReadingTime.setText(time);
        } else {
            holder.tvReadingDate.setText("Sin fecha");
            holder.tvReadingTime.setText(group.size() + " sensor(es)");
        }

        holder.btnVerLectura.setOnClickListener(v -> listener.onView(group));
    }

    @Override
    public int getItemCount() {
        return groups.size();
    }

    static class ReadingViewHolder extends RecyclerView.ViewHolder {
        TextView tvReadingDate, tvReadingTime;
        Button btnVerLectura;

        public ReadingViewHolder(@NonNull View itemView) {
            super(itemView);
            tvReadingDate = itemView.findViewById(R.id.tvReadingDate);
            tvReadingTime = itemView.findViewById(R.id.tvReadingTime);
            btnVerLectura = itemView.findViewById(R.id.btnVerLectura);
        }
    }
}
