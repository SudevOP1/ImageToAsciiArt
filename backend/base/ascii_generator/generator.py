from PIL import Image
import os

gray_scale_string = " .:-=+*#%@"

def get_ascii_text(img_path, w, h):
    img = Image.open(img_path)
    img = img.resize((w, h))
    pixels = img.load()
    ascii_text = ""
    for j in range(h):
        for i in range(w):
            r, g, b = pixels[i, j]
            brightness = (r+g+b) * len(gray_scale_string) // (255*3)
            ascii_text += gray_scale_string[brightness]
        ascii_text += "\n"
    return ascii_text

if __name__ == "__main__":
    sunflower_img = f"{os.getcwd().replace("\\", "\\\\")}\\sunflower.jpg"
    print(get_ascii_text(sunflower_img, 100, 50))
