package com.moneymind.app;

import android.graphics.Color;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    public static MainActivity instance;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;

        // Match WebView background with MoneyMind clean theme & optimize startup rendering
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(Color.parseColor("#ffffff"));
            getBridge().getWebView().getSettings().setDomStorageEnabled(true);
            getBridge().getWebView().getSettings().setDatabaseEnabled(true);
            getBridge().getWebView().getSettings().setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
        }
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
