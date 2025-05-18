from PIL import Image
import os

gray_scale_string = " .:-=+*#%@"

def get_ascii_text(img_path, w, h):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((w, h))
    pixels = img.load()
    ascii_text = ""

    for j in range(h):
        for i in range(w):
            r, g, b = pixels[i, j]
            brightness = (r + g + b) / (255 * 3)  # Normalize to 0-1
            brightness_index = int(brightness * (len(gray_scale_string) - 1))
            ascii_text += gray_scale_string[brightness_index]
        ascii_text += "\n"

    return ascii_text

if __name__ == "__main__":
    sunflower_img = os.path.join(os.getcwd(), "sunflower.png")
    print(get_ascii_text(sunflower_img, 100, 50))
