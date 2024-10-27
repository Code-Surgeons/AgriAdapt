"""Utils function for the AgriAdapt application"""
import base64

plants = [
    "Maize",
    "Lemon",
    "Capsicum",
    "Cauliflower",
    "Green Chilli",
    "Pumpkin",
    "Tomato",
    "Brinjal",
    "Cabbage",
    "Bhindi (Ladies Finger)",
    "Bottle gourd",
    "Onion",
    "Potato",
    "Ginger (Green)",
    "Paddy (Dhan) (Common)",
    "Ber (Zizyphus/Borehannu)",
    "Garlic",
    "Guar Seed (Cluster Beans Seed)",
    "Pointed gourd (Parval)",
    "Red Gram",
    "Tinda",
    "White Muesli",
    "Tamarind Fruit",
    "Ashgourd",
    "Beans",
    "Bitter gourd",
    "Little gourd (Kundru)",
    "Squash (Chappal Kadoo)",
    "Elephant Yam (Suran)",
    "Bengal Gram (Gram) (Whole)",
    "Castor Seed",
    "Cummin Seed (Jeera)",
    "Groundnut",
    "Soyabean",
    "Coriander (Leaves)",
    "Black Gram (Urd Beans) (Whole)",
    "Sesamum (Sesame, Gingelly, Til)",
    "Soanf",
    "Bajra (Pearl Millet/Cumbu)",
    "Wheat",
    "Green Gram (Moong) (Whole)",
    "Arhar (Tur/Red Gram) (Whole)",
    "Beetroot",
    "Kulthi (Horse Gram)",
    "Cluster beans",
    "Isabgul (Psyllium)",
    "Suva (Dill Seed)",
    "Kabuli Chana (Chickpeas - White)",
    "Methi (Leaves)",
    "Coriander seed",
    "Jowar (Sorghum)",
    "Methi Seeds",
    "Cucumber (Kheera)",
    "Drumstick",
    "Spinach",
    "Ridgeguard (Tori)",
    "Carrot",
    "Paddy (Dhan) (Basmati)",
    "Radish",
    "French Beans (Frasbean)",
    "Papaya",
    "Colacasia",
    "Sponge gourd",
    "Turnip",
    "Peas Wet",
    "Cowpea (Veg)",
    "Amphophalus",
    "Mint (Pudina)",
    "Amaranthus",
    "Arecanut (Betelnut/Supari)",
    "Field Pea",
    "Indian Beans (Seam)",
    "Snakeguard",
    "Cloves",
    "Rice",
    "Black pepper",
    "Copra",
    "Sweet Potato",
    "Pepper ungarbled",
    "Tapioca",
    "Coconut Seed",
    "Coffee",
    "Mustard",
    "Lentil (Masur) (Whole)",
    "Chili Red",
    "Kutki",
    "Chilly Capsicum",
    "Guar",
    "Tender Coconut",
    "Round gourd",
    "Mushrooms",
    "Green Peas",
    "Barley (Jau)",
    "Taramira",
    "Cowpea (Lobia/Karamani)",
    "Onion Green",
    "Green Avare (W)",
    "Thondekai",
    "Yam (Ratalu)",
    "Amla (Nelli Kai)",
    "Gram Raw (Chholia)",
    "Groundnut (Split)",
    "Cashewnuts",
    "Ragi (Finger Millet)",
    "White Pumpkin"
]


def retrieve_state_district(client,place):
    """Helper function to retrieve the location details"""
    prompt =  f"""
        Where is {place} in India? Respond only with the district and state in this format: District, State
        For example: "Bangalore Rural, Karnataka"
        Strictly follow the above format
        """
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    return str(completion.choices[0].message.content)

def encode_image(image_data):
    """Helper function to convert the image into base64 format"""
    return base64.b64encode(image_data).decode('utf-8')
