#!/usr/bin/env python3
"""
Create high-quality product visuals using ImageMagick
Generate professional graphics for XeriaCO Moon Lamp
"""
import subprocess
import os

def create_hero_image():
    """Create a professional hero image with gradients and text"""
    output = "/root/clawd/moon-lamp-hero.png"
    
    cmd = [
        "convert",
        "-size", "1920x1080",
        "gradient:#0a0a0a-#1a1a3a",
        "-gravity", "center",
        "-pointsize", "120",
        "-fill", "white",
        "-font", "DejaVu-Sans-Bold",
        "-annotate", "+0-200", "XeriaCO",
        "-pointsize", "60",
        "-fill", "#00aaff", 
        "-annotate", "+0-100", "Magnetic Levitating",
        "-pointsize", "80",
        "-fill", "#ffaa00",
        "-annotate", "+0-20", "MOON LAMP",
        "-pointsize", "50",
        "-fill", "white",
        "-annotate", "+0+80", "✨ Defies Gravity • Silent Levitation ✨",
        "-pointsize", "70",
        "-fill", "#00ff88",
        "-annotate", "+0+160", "$54.99 - FREE SHIPPING 🇦🇺",
        output
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Hero image created: {output}")
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ Hero creation failed: {e}")
        return None

def create_feature_showcase():
    """Create feature showcase image"""
    output = "/root/clawd/moon-lamp-features.png"
    
    cmd = [
        "convert",
        "-size", "1920x1080",
        "gradient:#16213e-#0f3460",
        "-gravity", "center",
        "-pointsize", "100",
        "-fill", "yellow",
        "-font", "DejaVu-Sans-Bold",
        "-annotate", "+0-300", "THREE LIGHT MODES",
        "-pointsize", "60",
        "-fill", "white",
        "-annotate", "-400-150", "🌕 WARM",
        "-annotate", "+0-150", "🌙 COOL", 
        "-annotate", "+400-150", "🌈 COLOR",
        "-pointsize", "50",
        "-fill", "#ffaa00",
        "-annotate", "-400-80", "Cozy ambiance",
        "-annotate", "+0-80", "Focus lighting",
        "-annotate", "+400-80", "Party mode",
        "-pointsize", "80", 
        "-fill", "#00ffaa",
        "-annotate", "+0+100", "1:1,000,000 Scale",
        "-pointsize", "60",
        "-fill", "white",
        "-annotate", "+0+180", "Authentic Lunar Surface Detail",
        output
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Features image created: {output}")
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ Features creation failed: {e}")
        return None

def create_lifestyle_image():
    """Create lifestyle/room setting image"""
    output = "/root/clawd/moon-lamp-lifestyle.png" 
    
    cmd = [
        "convert",
        "-size", "1920x1080",
        "gradient:#2c1810-#1a1a1a",
        "-gravity", "center",
        "-pointsize", "90",
        "-fill", "#ffaa00",
        "-font", "DejaVu-Sans-Bold", 
        "-annotate", "+0-250", "TRANSFORMS ANY ROOM",
        "-pointsize", "60",
        "-fill", "white",
        "-annotate", "-500-100", "🏠 BEDROOM",
        "-annotate", "+0-100", "📚 OFFICE",
        "-annotate", "+500-100", "🛋️ LIVING ROOM", 
        "-pointsize", "50",
        "-fill", "#aaaaaa",
        "-annotate", "-500-40", "Peaceful sleep",
        "-annotate", "+0-40", "Focus & productivity",
        "-annotate", "+500-40", "Conversation starter",
        "-pointsize", "80",
        "-fill", "#00ff88",
        "-annotate", "+0+100", "PREMIUM AUSTRALIAN DESIGN",
        "-pointsize", "60", 
        "-fill", "white",
        "-annotate", "+0+180", "Silent • Stable • Stunning",
        output
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Lifestyle image created: {output}")
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ Lifestyle creation failed: {e}")
        return None

def create_cta_image():
    """Create call-to-action image"""
    output = "/root/clawd/moon-lamp-cta.png"
    
    cmd = [
        "convert",
        "-size", "1920x1080",
        "gradient:#e94560-#0f3460",
        "-gravity", "center",
        "-pointsize", "110",
        "-fill", "white",
        "-font", "DejaVu-Sans-Bold",
        "-annotate", "+0-200", "SPECIAL PRICE",
        "-pointsize", "140",
        "-fill", "yellow",
        "-annotate", "+0-50", "$54.99",
        "-pointsize", "70",
        "-fill", "white", 
        "-annotate", "+0+50", "FREE SHIPPING AUSTRALIA 🇦🇺",
        "-pointsize", "90",
        "-fill", "#00ffaa",
        "-annotate", "+0+150", "ORDER NOW",
        "-pointsize", "60",
        "-fill", "white",
        "-annotate", "+0+230", "XeriaCO.com",
        output
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ CTA image created: {output}")
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ CTA creation failed: {e}")
        return None

def create_video_with_visuals():
    """Create professional video using the generated images"""
    images = [
        "/root/clawd/moon-lamp-hero.png",
        "/root/clawd/moon-lamp-features.png", 
        "/root/clawd/moon-lamp-lifestyle.png",
        "/root/clawd/moon-lamp-cta.png"
    ]
    
    audio_file = "/root/clawd/xeriaco-moon-lamp-ad-audio.mp3"
    output = "/root/clawd/xeriaco-moon-lamp-visual-ad.mp4"
    
    # Create video with image sequences
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-t", "5", "-i", images[0],
        "-loop", "1", "-t", "5", "-i", images[1], 
        "-loop", "1", "-t", "5", "-i", images[2],
        "-loop", "1", "-t", "6", "-i", images[3],
        "-i", audio_file,
        "-filter_complex", 
        "[0:v]scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v0];"
        "[1:v]scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v1];"
        "[2:v]scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v2];"
        "[3:v]scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=5.5:d=0.5[v3];"
        "[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]",
        "-map", "[v]", "-map", "4:a",
        "-shortest",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-c:a", "aac",
        "-pix_fmt", "yuv420p",
        output
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Visual video created: {output}")
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ Visual video creation failed: {e}")
        return None

if __name__ == "__main__":
    print("🎨 Creating professional product visuals...")
    
    # Create all images
    hero = create_hero_image()
    features = create_feature_showcase() 
    lifestyle = create_lifestyle_image()
    cta = create_cta_image()
    
    # Create video with visuals
    if all([hero, features, lifestyle, cta]):
        video = create_video_with_visuals()
        print(f"\n✅ ALL VISUALS CREATED SUCCESSFULLY!")
        print(f"Hero: {hero}")
        print(f"Features: {features}")
        print(f"Lifestyle: {lifestyle}")
        print(f"CTA: {cta}")
        if video:
            print(f"Video: {video}")
    else:
        print("❌ Some visuals failed to create")