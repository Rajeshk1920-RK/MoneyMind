import os
from PIL import Image, ImageDraw

def restore_classic_logo_assets():
    logo_path = os.path.join('src', 'assets', 'logo.png')
    if not os.path.exists(logo_path):
        logo_path = os.path.join('public', 'logo.png')
    
    logo_img = Image.open(logo_path).convert('RGBA')
    res_dir = os.path.join('android', 'app', 'src', 'main', 'res')
    
    # 1. Launcher icons (Classic clean style directly using the logo)
    mipmap_configs = {
        'mipmap-mdpi': (48, 108),
        'mipmap-hdpi': (72, 162),
        'mipmap-xhdpi': (96, 216),
        'mipmap-xxhdpi': (144, 324),
        'mipmap-xxxhdpi': (192, 432),
    }
    
    for folder, (size, fg_size) in mipmap_configs.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # ic_launcher.png (Clean full logo resized with smooth LANCZOS)
        icon = logo_img.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(os.path.join(folder_path, 'ic_launcher.png'), format='PNG')
        
        # ic_launcher_round.png (Circular masked original logo)
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        round_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_icon.paste(icon, (0, 0), mask=mask)
        round_icon.save(os.path.join(folder_path, 'ic_launcher_round.png'), format='PNG')
        
        # ic_launcher_foreground.png (Adaptive icon foreground ~70% of canvas)
        fg_canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
        logo_size = int(fg_size * 0.70)
        offset = (fg_size - logo_size) // 2
        resized_fg = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        fg_canvas.paste(resized_fg, (offset, offset), mask=resized_fg)
        fg_canvas.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), format='PNG')
        print(f"Generated classic launcher icons for {folder}")

    # 2. Splash screen icon for Android 12+ (Centered logo with safe padding)
    splash_icon_canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    # Android 12 requires safe-zone <= 288px inside 512x512
    splash_logo_size = 280
    resized_splash_logo = logo_img.resize((splash_logo_size, splash_logo_size), Image.Resampling.LANCZOS)
    splash_offset = (512 - splash_logo_size) // 2
    splash_icon_canvas.paste(resized_splash_logo, (splash_offset, splash_offset), mask=resized_splash_logo)
    splash_icon_path = os.path.join(res_dir, 'drawable', 'ic_launcher_splash.png')
    splash_icon_canvas.save(splash_icon_path, format='PNG')
    print(f"Saved {splash_icon_path}")

    # 3. Clean full-bleed Splash screens for all densities (Classic clean white background)
    splash_configs = {
        'drawable': (1080, 1920),
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (1080, 1920),
        'drawable-port-xxxhdpi': (1440, 2560),
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1920, 1080),
        'drawable-land-xxxhdpi': (2560, 1440),
    }

    for folder, (w, h) in splash_configs.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Clean white background
        splash_bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
        min_dim = min(w, h)
        logo_dim = int(min_dim * 0.38)
        resized_logo = logo_img.resize((logo_dim, logo_dim), Image.Resampling.LANCZOS)
        
        x = (w - logo_dim) // 2
        y = (h - logo_dim) // 2
        splash_bg.paste(resized_logo, (x, y), mask=resized_logo)
        splash_bg.save(os.path.join(folder_path, 'splash.png'), format='PNG')
        print(f"Generated classic splash for {folder}")

    # Favicon
    img_fav = logo_img.resize((64, 64), Image.Resampling.LANCZOS)
    img_fav.save(os.path.join('public', 'favicon.ico'), format='ICO')
    print("Classic app logo and splash assets restored successfully!")

if __name__ == '__main__':
    restore_classic_logo_assets()
