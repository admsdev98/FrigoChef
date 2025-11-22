import base64

def encode_base64(image_path: str):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def decode_base64_to_file(base64_string: str, output_path: str):
    with open(output_path, "wb") as output_file:
        output_file.write(base64.b64decode(base64_string))