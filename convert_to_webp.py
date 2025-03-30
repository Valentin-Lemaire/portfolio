import os
from PIL import Image
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def convert_to_webp(input_dir: str = 'static', quality: int = 80) -> None:
    """
    Convert all PNG files in the specified directory to WebP format.
    
    Args:
        input_dir (str): Directory containing PNG files
        quality (int): WebP quality setting (0-100)
    """
    static_dir = Path(input_dir)
    
    if not static_dir.exists():
        logger.error(f"Directory {input_dir} does not exist")
        return
    
    # Get all PNG files
    png_files = list(static_dir.glob('*.png'))
    logger.info(f"Found {len(png_files)} PNG files to convert")
    
    # Convert each PNG to WebP
    for png_path in png_files:
        try:
            # Open the PNG image
            with Image.open(png_path) as img:
                # Convert to RGB if necessary (for PNGs with transparency)
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1])
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Create WebP filename
                webp_path = png_path.with_suffix('.webp')
                
                # Convert and save as WebP
                img.save(
                    webp_path,
                    'WEBP',
                    quality=quality,
                    method=6,  # Highest quality compression
                    lossless=False
                )
                logger.info(f"Converted {png_path.name} to {webp_path.name}")
                
        except Exception as e:
            logger.error(f"Error converting {png_path.name}: {str(e)}")

if __name__ == '__main__':
    convert_to_webp() 