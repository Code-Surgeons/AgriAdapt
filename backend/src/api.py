"""Backend for the AgriAdapt application"""
from fastapi import FastAPI, File, HTTPException, UploadFile, Form
from assistant_utils import encode_image
from service import AgriGPT
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

agri_assistant = AgriGPT()
# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

async def generate_stream(generator):
    async for content in generator:
        yield f"data: {content}\n\n"


@app.post("/check_image")
async def get_image_result(
    file: UploadFile = File(..., description="Upload an image of the soil"),
):
    """Endpoint for the soil analysis"""
    # Read and encode the image in base64 format
    try:
        image_data = await file.read()
    except Exception as err:
        raise HTTPException(status_code=400, detail="Failed to read the uploaded file.") from err

    try:
        base64_image = encode_image(image_data)
    except Exception as err:
        raise HTTPException(status_code=400, detail="Failed to encode the image.") from err

    try:
        answer=agri_assistant.image_checker(base64_image)
        return {'result':answer}
    except Exception as err:
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the image.") from err

# Function to fetch data from the government API
@app.post("/crop_suggestion")
async def get_crop_suggestion(
    file: UploadFile = File(..., description="Upload an image of the soil"),
    location: str = Form(...),
    crop: str = Form(...),
    days: int = Form(...)
):
    """Endpoint for the soil analysis"""
    # Read and encode the image in base64 format
    try:
        image_data = await file.read()
    except Exception as err:
        raise HTTPException(status_code=400, detail="Failed to read the uploaded file.") from err

    try:
        base64_image = encode_image(image_data)
    except Exception as err:
        raise HTTPException(status_code=400, detail="Failed to encode the image.") from err

    try:
        return StreamingResponse(generate_stream(agri_assistant.crop_suggestor(days, location, crop, base64_image)), media_type="text/event-stream")
    except Exception as err:
        raise HTTPException(status_code=500, detail="An error occurred while generating crop suggestion.") from err

@app.post("/agriculture_suggestion")
async def get_agriculture_suggestion(
    option: str = Form(..., description="Option for the suggestion type"),
):
    """Endpoint for the crop/crop species/soil preparation recommendation"""
    # Validate input
    try:
        if option == "crop_alternative":
            agri_assistant.filter_output()
        return StreamingResponse(generate_stream(agri_assistant.alternative_suggestor(option)), media_type="text/event-stream")       
    except HTTPException as err:
        raise HTTPException(status_code=400, detail="Invalid suggestion option provided.") from err
    except Exception as err:
        raise HTTPException(status_code=500, detail="Failed to retrieve agriculture suggestion.") from err

@app.get("/get_prices")
async def get_prices():
    """Endpoint for getting the prices or fertilizer recommendation"""
    # Fetch commodity prices from the API
    try:
        if agri_assistant.selection == "soil_preparation":
            return StreamingResponse(
                generate_stream(agri_assistant.fertilizer_recommender()),
                media_type="text/event-stream",
            )

        elif agri_assistant.selection == "crop_species_alternatives":
            filtered_data = agri_assistant.fetch_commodity_prices()
            return StreamingResponse(
                generate_stream(agri_assistant.get_markdown(filtered_data, "species")),
                media_type="text/event-stream",
            )
           
        else:
            filtered_data = agri_assistant.fetch_commodity_alternative_prices()
            return StreamingResponse(
                generate_stream(agri_assistant.get_markdown(filtered_data, "alternatives")),
                media_type="text/event-stream",
            )
    except HTTPException as err:
        raise err  # Re-raise specific HTTPExceptions
    except Exception as err:
        raise HTTPException(status_code=500, detail="Failed to fetch and process prices.") from err

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)