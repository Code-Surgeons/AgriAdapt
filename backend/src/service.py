from dotenv import load_dotenv
import os
import pandas as pd
from openai import OpenAI
import requests
from assistant_utils import retrieve_state_district, plants
from fastapi import HTTPException

class AgriGPT:
    first_panel_output = None
    selection = None
    state = None
    district = None
    crop = None
    alternatives = []

    def __init__(self):
        load_dotenv()
        self.data_api_key = os.getenv("DATA_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Initialize data frames with error handling
        try:
            self.soil_data = pd.read_csv('soil_composition.csv')  # Example: contains soil data for all districts
            self.micronutrient_data = pd.read_csv('micronutrient_data.csv')
        except FileNotFoundError as e:
            raise HTTPException(status_code=500, detail="Required CSV file not found.") from e
        except pd.errors.EmptyDataError as e:
            raise HTTPException(status_code=500, detail="CSV file is empty.") from e
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to read CSV files.") from e

        self.client = OpenAI(api_key=self.openai_api_key)
        
        if not self.openai_api_key:
            raise HTTPException(status_code=500, detail="OpenAI API Key missing or improperly configured.")
    
    def fetch_commodity_prices(self):
        """Fetches the crop rpices from the data API """
        try:
            url = (
                f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
                f"?api-key={self.data_api_key}&format=json&filters%5Bstate.keyword%5D={self.state}&filters%5Bdistrict%5D={self.district}&filters%5Bcommodity%5D={self.crop}"
            )
            response = requests.get(url, timeout=60)
            response.raise_for_status()  # Raises an HTTPError for bad responses
            data = response.json()
            return data.get("records", [])
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail="Failed to fetch commodity prices.") from e

    def fetch_commodity_alternative_prices(self):
        """Fetches the prices of the crop alternatives if available"""
        all_crop_data = {}  # Dictionary to store results for each crop
        try:
            for crop in self.alternatives:
                url = (
                    f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
                    f"?api-key={self.data_api_key}&format=json&filters%5Bstate.keyword%5D={self.state}"
                    f"&filters%5Bdistrict%5D={self.district}&filters%5Bcommodity%5D={crop}"
                )
                response = requests.get(url, timeout=60)
                response.raise_for_status()  # Raises an HTTPError for bad responses
                data = response.json()
                crop_data = data.get("records", [])
                all_crop_data[crop] = crop_data
            return all_crop_data
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail="Failed to fetch alternative commodity prices.") from e

    def get_markdown(self, state_data,data_type):
        """Converts the data in markdown format"""
        if data_type=='alternatives':
            prompt = f"""Generate a markdown representation for the following price data:\n\n{state_data}
            Strictly if the {state_data} is None, then add the most recent historical data for the markets in {self.district},{self.state} for {self.alternatives}.
            But make sure to add a disclaimer that it is historical data and may not be accurate. 
            Strictly do not add any other disclaimer and only give the markdown representation.
            Strictly don't add table in the markdown representation.
            The format should strictly be:
            <h2>The prices for the crops in {self.district}, {self.state} mentioned are as follows:</h2>
            **Crop 1**: Rs. xxxxx per <unit> (Date: <date>) <line break>
            **Crop 2**: Rs. xxxxx per <unit> (Date: <date>) <line break>
            ....
            **Crop n**: Rs. xxxxx per <unit> (Date: <date>)
            Dont include anything else in the markdown representation.
            Dont add any markdown ```markdown ``` or anything else other than the format specified.
            """

            try:
                completion = self.client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ]
                )
                return completion.choices[0].message.content
            except Exception as e:
                raise HTTPException(status_code=500, detail="Failed to generate markdown table from GPT-4.") from e
        else:
            prompt = f"""Generate a markdown representation for the following price data:\n\n{state_data}
            Strictly if the {state_data} is None, then add a disclaimer that real time prices are not updated yet. 
            Strictly do not add any other disclaimer and only give the markdown representation.
            Strictly don't add table in the markdown representation.
            The format should strictly be:
            <h2>The prices for the crop alternatives in {self.district}, {self.state} are as follows:</h2>
            **Alternative 1**: Rs. xxxxx per <unit> (Date: <date>) <line break>
            **Alternative 2**: Rs. xxxxx per <unit> (Date: <date>) <line break>
            ....
            **Alternative n**: Rs. xxxxx per <unit> (Date: <date>)
            Dont include anything else in the markdown representation.
            Dont add any markdown ```markdown ``` or anything else other than the format specified.  
            """
            try:
                completion = self.client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ]
                )
                return completion.choices[0].message.content
            except Exception as e:
                raise HTTPException(status_code=500, detail="Failed to generate markdown table from GPT-4.") from e
             
    def fertilizer_recommender(self):
        """Generates fertilizer recommendation based on the soil nutrient data of the particular state"""
        try:
            soil_composition = self.soil_data[(self.soil_data['State'] == self.state.upper())]
            micronutrient_composition = self.micronutrient_data[(self.micronutrient_data['State'] == self.state.upper())]
            if soil_composition.empty or micronutrient_composition.empty:
                raise HTTPException(status_code=404, detail="Data not found for the given state and district.")

            soil_data_dict = soil_composition.to_dict(orient='records')[0]
            micronutrient_data_dict = micronutrient_composition.to_dict(orient='records')[0]

            # Prepare the input for GPT-4o
            prompt = f"""
            Given the following soil composition and micronutrient data for growing {self.crop}:

            Soil Composition: {soil_data_dict}
            Micronutrient Composition: {micronutrient_data_dict}

            Recommend afforadable, locally accessible and sustainable fertilizers to improve growth for {self.crop} in {self.district}, {self.state}.
            Prioritize options that are environmentally friendly, widely available, and cost-effective for farmers in the region. Avoid expensive or rare resources.
            """
            # Call the GPT-4o model
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )

            return completion.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to generate fertilizer recommendation.") from e

    def crop_suggestor(self, days, location, crop, base64_image):
        """Suggests crop details based on soil analysis of the image provided"""
        try:
            response = retrieve_state_district(self.client, location)
            self.district, self.state = response.split(", ")
            self.crop = crop
            prompt_text = f"""
            You are given an image of soil and additional information about the location and desired crop.

            Information:
            - District: {self.district}
            - State: {self.state}
            - Crop: {self.crop}
            - Growing period in days: {days}

            Please analyze the soil based on the provided image and consider the climate conditions typical for {self.district}, {self.state}.
            Ensure recommendations are inclusive and consider cost-effective, accessible options. Assess:
            1. A soil composition analysis based on the image, including possible nutrient content, texture, and any visible properties.
            2. The suitability of growing {self.crop} in this soil, given the climate conditions for {self.district}, {self.state}.
            3. The viability of growing {self.crop} over a period of {days} days in the specified location, taking into account typical weather patterns and soil compatibility.

            Respond in this format:
            - **Soil Analysis**: <description of soil composition, nutrient content, etc.>
            - **Crop Suitability**: <yes/no> with a brief explanation based on soil and climate.
            - **Viability over {days} days**: <likely viable/not viable> with reasoning, including any climate considerations.
            """

            # Send the prompt and image to GPT-4o API
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt_text,
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpg;base64,{base64_image}"
                                },
                            },
                        ],
                    }
                ],
            )

            # Extract the suggestion from the response
            suggestion = response.choices[0].message.content
            self.first_panel_output = suggestion
            return suggestion
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get a response from GPT-4") from e
    
    def alternative_suggestor(self, option):
        """Gives recommendations based on the input and the climate conditions of the location"""
        if option not in ["crop_alternative", "soil_preparation", "crop_species_alternatives"]:
            raise HTTPException(status_code=400, detail="Invalid option. Choose from 'crop alternative', 'soil preparation', or 'crop species alternatives'.")

        self.selection = option
        prompt = ""
        
        # Step 1: Get general climate conditions for the location
        climate_prompt = f"""
        Please provide an overview of the general climate conditions for {self.district}, {self.state}, including average temperature, rainfall, and any seasonal variations. 
        """
        try:
            climate_response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a knowledgeable assistant providing climate information."},
                    {"role": "user", "content": climate_prompt}
                ]
            )
            climate_conditions = climate_response.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to retrieve climate conditions") from e

        # Step 2: Construct the main prompt based on the option and retrieved climate conditions
        if option == "crop_alternative":
            prompt = f"""
            Based on the provided soil analysis and climate conditions, suggest alternative crops that would thrive in these conditions.
            
            - **Soil Analysis**: {self.first_panel_output}
            - **Climate Conditions**: {climate_conditions}

            Suggest top three crop alternatives that are suitable for the soil and climate conditions described and is included in this {plants} other than {self.crop}.
            """
        elif option == "soil_preparation":
            prompt = f"""
            Based on the provided soil analysis, suggest measures to improve the soil conditions to make it suitable for growing {self.crop}.

            - **Soil Analysis**: {self.first_panel_output}
            - **Climate Conditions**: {climate_conditions}

            Include specific soil amendments, preparation methods, and other factors to optimize the soil for {self.crop} growth. 
            Avoid recommending resources that are rare or expensive.
            """
        elif option == "crop_species_alternatives":
            prompt = f"""
            Based on the provided soil analysis and climate conditions, suggest alternative species of {self.crop} that would grow well in the given soil and climate conditions.
            
            - **Soil Analysis**: {self.first_panel_output}
            - **Climate Conditions**: {climate_conditions}

            Provide specific species or varieties of {self.crop} that are best suited to these conditions and are widely available, prioritizing those that are accessible and cost-effective for local farmers.
            """

        # Step 3: Request the main suggestion from GPT-4o
        try:
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an agricultural expert providing tailored recommendations."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extracting the suggestion from the response
            suggestion = completion.choices[0].message.content
            return suggestion
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get a response from GPT-4") from e
    
    def filter_output(self, suggestion):
        """Helper function to convert the list string to python list object"""
        prompt = f"""
        Given the following text, please extract the names of the crops and return them as a Python list:
        {suggestion}
        """

        # Call the API
        try:
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a python coding expert"},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extracting the suggestion from the response
            response = completion.choices[0].message.content
            self.alternatives = [item.strip() for item in response.strip("[]").split(",")]
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get a response from GPT-4") from e
