import os
from PIL import Image
from pathlib import Path

def convert_to_webp():
    # Get the static directory path
    static_dir = Path('static')
    
    # Create a list of all PNG files in the static directory
    png_files = list(static_dir.glob('*.png'))
    
    print(f"Found {len(png_files)} PNG files to convert")
    
    # Convert each PNG to WebP
    for png_path in png_files:
        try:
            # Open the PNG image
            with Image.open(png_path) as img:
                # Create WebP filename
                webp_path = png_path.with_suffix('.webp')
                
                # Convert and save as WebP with quality=80
                img.save(webp_path, 'WEBP', quality=80)
                print(f"Converted {png_path.name} to {webp_path.name}")
                
        except Exception as e:
            print(f"Error converting {png_path.name}: {str(e)}")

if __name__ == '__main__':
    convert_to_webp() 