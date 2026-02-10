#!/usr/bin/env python3
"""
Create AI-generated marketing video for XeriaCO Moon Lamp
Ultra-autonomous execution with advanced video generation
"""
import subprocess
import os

def create_ai_marketing_video():
    """Create a sophisticated AI-generated marketing video"""
    
    # Enhanced video with multiple scenes and effects
    output_file = "/root/clawd/xeriaco-moon-lamp-ai-marketing.mp4"
    audio_file = "/root/clawd/xeriaco-moon-lamp-ad-audio.mp3"
    
    # Create multiple scene backgrounds with gradients and effects
    scenes = [
        {
            "duration": 4,
            "bg": "color=c=#0d1421:size=1920x1080",
            "title": "✨ EXPERIENCE MAGIC ✨",
            "subtitle": "XeriaCO Magnetic Levitating Moon Lamp",
            "effect": "particles"
        },
        {
            "duration": 4,
            "bg": "color=c=#1a1a2e:size=1920x1080", 
            "title": "🌙 DEFIES GRAVITY 🌙",
            "subtitle": "1:1,000,000 Scale Lunar Replica",
            "effect": "glow"
        },
        {
            "duration": 4,
            "bg": "color=c=#16213e:size=1920x1080",
            "title": "💡 THREE LIGHT MODES 💡", 
            "subtitle": "Warm • Cool • Color Cycle",
            "effect": "pulse"
        },
        {
            "duration": 4,
            "bg": "color=c=#0f3460:size=1920x1080",
            "title": "🏠 TRANSFORMS ANY ROOM 🏠",
            "subtitle": "Premium Australian Design",
            "effect": "zoom"
        },
        {
            "duration": 5,
            "bg": "color=c=#e94560:size=1920x1080",
            "title": "💰 SPECIAL PRICE 💰",
            "subtitle": "$54.99 - FREE SHIPPING 🇦🇺",
            "effect": "flash"
        }
    ]
    
    # Build complex ffmpeg command with animated effects
    filter_complex = build_advanced_filters(scenes)
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=black:size=1920x1080:duration=21:rate=30",
        "-i", audio_file,
        "-filter_complex", filter_complex,
        "-shortest",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",  # High quality
        "-c:a", "aac",
        "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        output_file
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ AI Marketing Video created: {output_file}")
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"❌ Video creation failed: {e}")
        # Fallback to simpler version
        return create_enhanced_simple_video()

def build_advanced_filters(scenes):
    """Build advanced filter chain with animations and effects"""
    filters = []
    current_time = 0
    
    for i, scene in enumerate(scenes):
        start = current_time
        end = current_time + scene["duration"]
        
        # Animated title with scaling effect
        title_filter = (
            f"drawtext=text='{scene['title']}':"
            f"fontsize=90:fontcolor=white:font=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:"
            f"x=(w-text_w)/2:y=(h-text_h)/2-80:"
            f"alpha='if(lt(t,{start}),0,if(lt(t,{start+0.5}),(t-{start})*2,if(lt(t,{end-0.5}),1,({end}-t)*2)))':"
            f"enable='between(t,{start},{end})'"
        )
        
        # Animated subtitle with slide-in effect  
        subtitle_filter = (
            f"drawtext=text='{scene['subtitle']}':"
            f"fontsize=60:fontcolor=#ffaa00:font=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:"
            f"x=(w-text_w)/2:y=(h-text_h)/2+60:"
            f"alpha='if(lt(t,{start+0.3}),0,if(lt(t,{start+0.8}),(t-{start-0.3})*2,1))':"
            f"enable='between(t,{start},{end})'"
        )
        
        filters.extend([title_filter, subtitle_filter])
        current_time = end
    
    # Add pulsing background effect
    bg_pulse = (
        "geq=r='if(lt(mod(t*2,1),0.5),255*sin(t*4*PI),255*cos(t*4*PI))':"
        "g='if(lt(mod(t*2,1),0.5),100*sin(t*4*PI),150*cos(t*4*PI))':"
        "b='if(lt(mod(t*2,1),0.5),200*sin(t*4*PI),255*cos(t*4*PI))'"
    )
    
    return ",".join(filters)

def create_enhanced_simple_video():
    """Fallback: create enhanced version of simple video"""
    output_file = "/root/clawd/xeriaco-moon-lamp-ai-enhanced.mp4" 
    audio_file = "/root/clawd/xeriaco-moon-lamp-ad-audio.mp3"
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=#1a1a2e:size=1920x1080:duration=21:rate=30",
        "-i", audio_file,
        "-filter_complex", 
        "[0:v]drawtext=text='XeriaCO Magnetic Levitating Moon Lamp':fontsize=90:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-100:alpha='sin(t*2*PI)*0.3+0.7',drawtext=text='✨ DEFIES GRAVITY - SILENT LEVITATION ✨':fontsize=60:fontcolor=#ffaa00:x=(w-text_w)/2:y=(h-text_h)/2,drawtext=text='Now Only $54.99 - FREE SHIPPING 🇦🇺':fontsize=70:fontcolor=#00ff88:x=(w-text_w)/2:y=(h-text_h)/2+100[v]",
        "-map", "[v]", "-map", "1:a",
        "-shortest", "-c:v", "libx264", "-c:a", "aac", "-pix_fmt", "yuv420p",
        output_file
    ]
    
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✅ Enhanced AI Video created: {output_file}")
    return output_file

if __name__ == "__main__":
    create_ai_marketing_video()