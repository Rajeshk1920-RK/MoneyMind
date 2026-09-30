package com.moneymind.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    public static MainActivity instance;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        instance = null;
    }

    public void notifySmsReceived(String sender, String body) {
        runOnUiThread(() -> {
            try {
                JSONObject data = new JSONObject();
                data.put("sender", sender);
                data.put("text", body);
                String js = "window.dispatchEvent(new CustomEvent('nativeSmsReceived', { detail: " + data.toString() + " }));";
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().evaluateJavascript(js, null);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
