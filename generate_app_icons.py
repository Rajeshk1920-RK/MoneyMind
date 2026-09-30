import os
from PIL import Image, ImageDraw

def create_icons():
    logo_path = os.path.join('src', 'assets', 'logo.png')
    if not os.path.exists(logo_path):
        logo_path = os.path.join('public', 'logo.png')
    
    img = Image.open(logo_path).convert('RGBA')
    
    res_dir = os.path.join('android', 'app', 'src', 'main', 'res')
    
    # 1. Launcher icons
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
        
        # ic_launcher.png (square with rounded corners or full icon)
        icon = img.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(os.path.join(folder_path, 'ic_launcher.png'), format='PNG')
        
        # ic_launcher_round.png (circular masked)
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        round_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_icon.paste(icon, (0, 0), mask=mask)
        round_icon.save(os.path.join(folder_path, 'ic_launcher_round.png'), format='PNG')
        
        # ic_launcher_foreground.png (foreground on transparent canvas, centered ~66% size)
        fg_canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
        logo_size = int(fg_size * 0.68)
        offset = (fg_size - logo_size) // 2
        resized_logo = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        fg_canvas.paste(resized_logo, (offset, offset), mask=resized_logo)
        fg_canvas.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), format='PNG')
        print(f"Generated icons for {folder}")

    # 2. Splash screens
    splash_configs = {
        'drawable': (480, 800),
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (960, 1600),
        'drawable-port-xxxhdpi': (1280, 1920),
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1600, 960),
        'drawable-land-xxxhdpi': (1920, 1280),
    }

    for folder, (w, h) in splash_configs.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        splash_bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
        # Center logo ~30% of min dimension
        min_dim = min(w, h)
        logo_splash_size = int(min_dim * 0.35)
        resized_logo = img.resize((logo_splash_size, logo_splash_size), Image.Resampling.LANCZOS)
        
        x = (w - logo_splash_size) // 2
        y = (h - logo_splash_size) // 2
        splash_bg.paste(resized_logo, (x, y), mask=resized_logo)
        splash_bg.save(os.path.join(folder_path, 'splash.png'), format='PNG')
        print(f"Generated splash for {folder}")

    # 3. Favicon & Web icon
    img_fav = img.resize((64, 64), Image.Resampling.LANCZOS)
    img_fav.save(os.path.join('public', 'favicon.ico'), format='ICO')
    print("All app logo assets generated successfully!")

if __name__ == '__main__':
    create_icons()
