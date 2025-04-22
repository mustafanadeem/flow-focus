package com.boltexpo.nativewind;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;

public class AppBlockingService extends Service {
    private WindowManager windowManager;
    private View blockingView;

    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        showBlockingOverlay();
        return START_STICKY;
    }

    private void showBlockingOverlay() {
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.CENTER;

        LayoutInflater inflater = LayoutInflater.from(this);
        blockingView = inflater.inflate(R.layout.blocking_overlay, null);

        Button disableButton = blockingView.findViewById(R.id.disable_button);
        disableButton.setOnClickListener(v -> {
            stopSelf();
        });

        windowManager.addView(blockingView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (blockingView != null) {
            windowManager.removeView(blockingView);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
} 