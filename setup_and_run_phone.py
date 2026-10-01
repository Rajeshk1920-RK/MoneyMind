import os
import sys
import urllib.request
import zipfile
import subprocess
import shutil

def setup_jdk_and_install():
    user_home = os.path.expanduser('~')
    jdk_target_dir = os.path.join(user_home, '.jdk21')
    
    # Check if JDK 21 already exists
    java_exe = None
    if os.path.exists(jdk_target_dir):
        for root, dirs, files in os.walk(jdk_target_dir):
            if 'java.exe' in files and 'bin' in root.lower():
                java_exe = os.path.join(root, 'java.exe')
                break
    
    if not java_exe:
        url = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.zip"
        zip_path = os.path.join(user_home, 'jdk21_temp.zip')
        print(f"Downloading OpenJDK 21 from Adoptium (Temurin 21)...")
        
        for attempt in range(1, 4):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=60) as response, open(zip_path, 'wb') as out_file:
                    total_size = int(response.headers.get('content-length', 0))
                    downloaded = 0
                    block_size = 1024 * 1024
                    while True:
                        buffer = response.read(block_size)
                        if not buffer:
                            break
                        downloaded += len(buffer)
                        out_file.write(buffer)
                        if total_size > 0:
                            percent = downloaded * 100 / total_size
                            sys.stdout.write(f"\rDownloading JDK 21: {percent:.1f}% ({downloaded/(1024*1024):.1f}MB / {total_size/(1024*1024):.1f}MB)")
                            sys.stdout.flush()
                print("\nDownload complete! Verifying zip...")
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    print("Extracting OpenJDK 21...")
                    os.makedirs(jdk_target_dir, exist_ok=True)
                    zip_ref.extractall(jdk_target_dir)
                break
            except Exception as e:
                print(f"\nAttempt {attempt} failed: {e}. Retrying...")
                if attempt == 3:
                    raise
        
        try:
            if os.path.exists(zip_path):
                os.remove(zip_path)
        except:
            pass
        print("JDK 21 setup complete!")

    # Find the root of JDK
    jdk_home = None
    for root, dirs, files in os.walk(jdk_target_dir):
        if 'bin' in dirs and os.path.exists(os.path.join(root, 'bin', 'java.exe')):
            jdk_home = root
            break
    
    if not jdk_home:
        print("Failed to locate JDK home directory.")
        return False

    print(f"JAVA_HOME is: {jdk_home}")
    
    # Set environment variables for build
    env = os.environ.copy()
    env['JAVA_HOME'] = jdk_home
    env['ANDROID_HOME'] = os.path.join(user_home, 'AppData', 'Local', 'Android', 'Sdk')
    env['ANDROID_SDK_ROOT'] = os.path.join(user_home, 'AppData', 'Local', 'Android', 'Sdk')
    env['PATH'] = os.path.join(jdk_home, 'bin') + os.pathsep + os.path.join(env['ANDROID_HOME'], 'platform-tools') + os.pathsep + env.get('PATH', '')
    
    # 1. Build Android APK
    android_dir = os.path.abspath('android')
    gradlew_bat = os.path.join(android_dir, 'gradlew.bat')
    
    print("\n--- Building MoneyMind Android Debug APK ---")
    ret = subprocess.run([gradlew_bat, 'assembleDebug'], cwd=android_dir, env=env)
    if ret.returncode != 0:
        print("Gradle build failed.")
        return False
        
    print("\n--- APK Built Successfully! ---")
    apk_path = os.path.join(android_dir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
    if not os.path.exists(apk_path):
        print(f"APK not found at {apk_path}")
        return False
        
    print(f"APK Path: {apk_path} (Size: {os.path.getsize(apk_path) / (1024*1024):.2f} MB)")
    
    # 2. Install to connected device via ADB
    adb_path = os.path.join(user_home, 'AppData', 'Local', 'Android', 'Sdk', 'platform-tools', 'adb.exe')
    if not os.path.exists(adb_path):
        adb_path = 'adb.exe'
        
    print("\n--- Installing MoneyMind APK onto connected mobile device via USB ---")
    install_res = subprocess.run([adb_path, 'install', '-r', apk_path], capture_output=True, text=True)
    print("ADB Output:", install_res.stdout)
    if install_res.stderr:
        print("ADB Stderr:", install_res.stderr)
        
    if "Success" in install_res.stdout:
        print("\n--- Launching MoneyMind on Phone ---")
        launch_res = subprocess.run([adb_path, 'shell', 'monkey', '-p', 'com.moneymind.app', '-c', 'android.intent.category.LAUNCHER', '1'], capture_output=True, text=True)
        print("App launched successfully on your mobile phone!")
        return True
    else:
        print("Failed to install APK directly to device.")
        return False

if __name__ == '__main__':
    setup_jdk_and_install()
