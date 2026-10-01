import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def get_font(size, bold=False):
    font_names = [
        'C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf'
    ]
    for fn in font_names:
        if os.path.exists(fn):
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_gradient_radial(w, h, color_center, color_edge):
    img = Image.new('RGBA', (w, h), color_edge)
    draw = ImageDraw.Draw(img)
    cx, cy = w / 2, h / 2
    max_r = math.sqrt(cx**2 + cy**2)
    
    # Draw radial gradient rings
    steps = 40
    for i in range(steps, 0, -1):
        ratio = i / steps
        r = max_r * ratio
        # Linear blend between color_center and color_edge
        r_col = int(color_center[0] * (1 - ratio) + color_edge[0] * ratio)
        g_col = int(color_center[1] * (1 - ratio) + color_edge[1] * ratio)
        b_col = int(color_center[2] * (1 - ratio) + color_edge[2] * ratio)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(r_col, g_col, b_col, 255))
    return img

def create_splash_badge(logo_img, badge_size):
    """Creates a high-end glowing squircle badge with the logo inside"""
    badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(badge)
    
    radius = int(badge_size * 0.28)
    padding = int(badge_size * 0.05)
    
    # Outer ambient glow / shadow
    glow_canvas = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_canvas)
    glow_draw.rounded_rectangle([padding, padding, badge_size - padding, badge_size - padding], radius=radius, fill=(16, 185, 129, 60))
    glow_canvas = glow_canvas.filter(ImageFilter.GaussianBlur(radius=int(badge_size * 0.04)))
    badge.paste(glow_canvas, (0, 0), mask=glow_canvas)
    
    # Badge background - sleek deep glassmorphism
    inner_pad = int(badge_size * 0.08)
    draw.rounded_rectangle(
        [inner_pad, inner_pad, badge_size - inner_pad, badge_size - inner_pad],
        radius=radius,
        fill=(15, 41, 30, 240),
        outline=(52, 211, 153, 200),
        width=max(2, int(badge_size * 0.02))
    )
    
    # Center logo inside badge
    logo_size = int((badge_size - 2 * inner_pad) * 0.72)
    resized_logo = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    lx = (badge_size - logo_size) // 2
    ly = (badge_size - logo_size) // 2
    badge.paste(resized_logo, (lx, ly), mask=resized_logo)
    
    return badge

def generate_all_assets():
    logo_path = os.path.join('src', 'assets', 'logo.png')
    if not os.path.exists(logo_path):
        logo_path = os.path.join('public', 'logo.png')
    
    logo_img = Image.open(logo_path).convert('RGBA')
    res_dir = os.path.join('android', 'app', 'src', 'main', 'res')
    
    # 1. Android 12+ Splash Animated Icon (512x512 with safe-zone centered badge)
    splash_icon_canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    # Android 12 safe-zone is within 288px diameter center circle
    badge_512 = create_splash_badge(logo_img, 280)
    splash_icon_canvas.paste(badge_512, ((512 - 280) // 2, (512 - 280) // 2), mask=badge_512)
    splash_icon_path = os.path.join(res_dir, 'drawable', 'ic_launcher_splash.png')
    splash_icon_canvas.save(splash_icon_path, format='PNG')
    print(f"Saved {splash_icon_path}")

    # 2. Launcher icons for all densities
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
        
        # Launcher icon
        app_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        icon_badge = create_splash_badge(logo_img, size)
        app_icon.paste(icon_badge, (0, 0), mask=icon_badge)
        app_icon.save(os.path.join(folder_path, 'ic_launcher.png'), format='PNG')
        
        # Round launcher icon
        mask = Image.new('L', (size, size), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse((0, 0, size, size), fill=255)
        round_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_icon.paste(app_icon, (0, 0), mask=mask)
        round_icon.save(os.path.join(folder_path, 'ic_launcher_round.png'), format='PNG')
        
        # Foreground icon (scaled for adaptive icon background)
        fg_canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
        fg_badge_size = int(fg_size * 0.72)
        fg_badge = create_splash_badge(logo_img, fg_badge_size)
        fg_offset = (fg_size - fg_badge_size) // 2
        fg_canvas.paste(fg_badge, (fg_offset, fg_offset), mask=fg_badge)
        fg_canvas.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), format='PNG')
        print(f"Generated launcher icons for {folder}")

    # 3. Full-bleed Splash Screens (All Screen Densities)
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

    # Brand Colors
    bg_center = (18, 56, 42)   # Deep lush emerald
    bg_edge = (8, 24, 18)      # Luxury dark obsidian emerald

    for folder, (w, h) in splash_configs.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        splash_bg = draw_gradient_radial(w, h, bg_center, bg_edge)
        draw = ImageDraw.Draw(splash_bg)
        
        is_portrait = h >= w
        min_dim = min(w, h)
        
        # Sizing relative to viewport
        badge_size = int(min_dim * (0.34 if is_portrait else 0.40))
        badge = create_splash_badge(logo_img, badge_size)
        
        badge_x = (w - badge_size) // 2
        badge_y = int(h * 0.36) - (badge_size // 2) if is_portrait else (h - badge_size) // 2 - int(h * 0.08)
        splash_bg.paste(badge, (badge_x, badge_y), mask=badge)
        
        # Typography: Brand Title "MoneyMind"
        title_font_size = max(16, int(min_dim * 0.085))
        title_font = get_font(title_font_size, bold=True)
        title_text = "MoneyMind"
        
        bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_w = bbox[2] - bbox[0]
        title_x = (w - title_w) // 2
        title_y = badge_y + badge_size + int(min_dim * 0.035)
        
        # Text shadow
        draw.text((title_x + 1, title_y + 2), title_text, font=title_font, fill=(0, 0, 0, 120))
        # Text crisp white
        draw.text((title_x, title_y), title_text, font=title_font, fill=(255, 255, 255, 255))
        
        # Tagline: "SMART WEALTH & FINANCES"
        sub_font_size = max(9, int(title_font_size * 0.36))
        sub_font = get_font(sub_font_size, bold=True)
        sub_text = "SMART WEALTH & FINANCES"
        
        sub_bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
        sub_w = sub_bbox[2] - sub_bbox[0]
        sub_x = (w - sub_w) // 2
        sub_y = title_y + (bbox[3] - bbox[1]) + int(min_dim * 0.02)
        
        draw.text((sub_x, sub_y), sub_text, font=sub_font, fill=(52, 211, 153, 240))
        
        # Bottom Security Tagline for Portrait
        if is_portrait:
            sec_font_size = max(8, int(min_dim * 0.026))
            sec_font = get_font(sec_font_size, bold=False)
            sec_text = "🔒 Bank-Grade 256-Bit Security • Private & Offline First"
            sec_bbox = draw.textbbox((0, 0), sec_text, font=sec_font)
            sec_w = sec_bbox[2] - sec_bbox[0]
            sec_x = (w - sec_w) // 2
            sec_y = int(h * 0.92)
            draw.text((sec_x, sec_y), sec_text, font=sec_font, fill=(110, 231, 183, 180))
        
        splash_out_path = os.path.join(folder_path, 'splash.png')
        splash_bg.save(splash_out_path, format='PNG')
        print(f"Generated rich splash for {folder}")

    # Also save favicon
    img_fav = logo_img.resize((64, 64), Image.Resampling.LANCZOS)
    img_fav.save(os.path.join('public', 'favicon.ico'), format='ICO')
    print("All premium splash and icon assets created successfully!")

if __name__ == '__main__':
    generate_all_assets()
