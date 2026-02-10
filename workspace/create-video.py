#!/usr/bin/env python3
"""
Create XeriaCO Moon Lamp advertisement video
Ultra-autonomous video creation with available resources
"""
import os
import subprocess
import tempfile

def create_moon_lamp_video():
    """Create a simple but effective video advertisement"""
    
    # Video settings
    duration = 30  # 30 seconds
    width = 1920
    height = 1080
    fps = 30
    
    audio_file = "/root/clawd/xeriaco-moon-lamp-ad-audio.mp3"
    output_file = "/root/clawd/xeriaco-moon-lamp-ad.mp4"
    
    # Create a simple text-based video with slides
    slides = [
        {
            "text": "✨ MAGIC IS REAL ✨\nXeriaCO Magnetic\nLevitating Moon Lamp",
            "duration": 5,
            "bg_color": "black",
            "text_color": "white"
        },
        {
            "text": "🌙 DEFIES GRAVITY 🌙\n1:1,000,000 Scale\nLunar Surface Replica",
            "duration": 5,
            "bg_color": "#1a1a2e",
            "text_color": "#eee2dc"
        },
        {
            "text": "💡 THREE LIGHT MODES 💡\nWarm • Cool • Color Cycle\nRemote Controlled",
            "duration": 5,
            "bg_color": "#16213e", 
            "text_color": "#0f4c75"
        },
        {
            "text": "🏠 TRANSFORMS ANY ROOM 🏠\nPremium Australian Design\nSilent Operation",
            "duration": 5,
            "bg_color": "#0f3460",
            "text_color": "#ffffff"
        },
        {
            "text": "💰 SPECIAL PRICE 💰\n$54.99 (Was $70)\nFREE SHIPPING 🇦🇺",
            "duration": 5,
            "bg_color": "#e94560",
            "text_color": "#ffffff"
        },
        {
            "text": "🚀 ORDER NOW 🚀\nXeriaCO.com\nLimited Time Offer",
            "duration": 5,
            "bg_color": "#0f4c75",
            "text_color": "#ffffff"
        }
    ]
    
    # Create video using ffmpeg with text overlays
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"color=c=black:size={width}x{height}:duration={duration}:rate={fps}",
        "-i", audio_file,
        "-filter_complex", create_text_filter(slides, width, height),
        "-shortest",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-pix_fmt", "yuv420p",
        output_file
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Video created successfully: {output_file}")
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"❌ Video creation failed: {e}")
        return None

def create_text_filter(slides, width, height):
    """Create ffmpeg filter for text overlays"""
    filters = []
    current_time = 0
    
    for i, slide in enumerate(slides):
        start_time = current_time
        end_time = current_time + slide["duration"]
        
        # Split text into lines for better formatting
        lines = slide["text"].split('\n')
        y_start = height // 2 - (len(lines) * 60) // 2
        
        for j, line in enumerate(lines):
            y_pos = y_start + (j * 80)
            
            text_filter = (
                f"drawtext=text='{line}':"
                f"fontsize=60:fontcolor={slide['text_color']}:"
                f"x=(w-text_w)/2:y={y_pos}:"
                f"enable='between(t,{start_time},{end_time})'"
            )
            filters.append(text_filter)
        
        current_time = end_time
    
    return ",".join(filters)

if __name__ == "__main__":
    create_moon_lamp_video()