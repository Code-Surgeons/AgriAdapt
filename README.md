# AgriAdapt: AI-Powered Assistant for Smarter Crop Choices

## Project Overview
**AgriAdapt** is an AI-driven tool designed to support Indian farmers in making informed, sustainable crop choices. By leveraging GPT-4o and GPT-4o-mini’s analytical abilities, AgriAdapt offers personalized crop recommendations based on factors like soil, climate,etc. promoting sustainable agricultural practices.

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Usage Documentation](#usage-documentation)
3. [AI Integration](#ai-integration)
4. [Prototype/Working Solution](#prototype-working-solution)
5. [Demo Video](#demo-video)
6. [Innovation & Originality](#innovation--originality)
7. [Team Roles](#team-roles)
8. [Optional Features](#optional-features)

---

## Demo Video
Check out our demo video that showcases AgriAdapt’s core functionality and features, including an in-depth look at how GPT-4 powers our AI model:
[Demo Video Link](https://youtu.be/7oc7-pMw5pw)

---

## Project Setup
To set up AgriAdapt locally:

1. **Clone the repository**:

    ```bash
    https://github.com/Code-Surgeons/AgriAdapt.git
    cd AgriAdapt
    ```

2. **Environment Configuration**:
   - Set up `OPENAI_API_KEY` keys for the GPT 4o models in the `.env` file.
   - Set up the `DATA_API_KEY` key for the data api by registering and getting the key from [here](https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi)

3. **Run the Application**:

   i. Build the docker images

    ```bash
       docker compose build
     ```
        
   ii. Start the application

    ```bash
       docker compose up -d
     ```


5. **Access the Application**:

   Open your browser and go to `http://localhost:5173`.

---

## Usage Documentation

AgriAdapt is designed to provide farmers with a seamless experience through its intuitive interface. The application is divided into three main panels, each serving a specific function to guide users in making informed crop choices:

### 1. Input Panel
- **User Inputs**: Farmers enter essential data, including:
  - Soil Health Card Image or Image of the soil
  - Desired crop type
  - Growth period

- **Functionality**: This panel collects the necessary information for analysis, ensuring the recommendations are tailored to the specific context of the user.

### 2. Recommendations Panel
- **User Inputs**: Farmers select one button from the following:

- **Crop Alternatives**: Based on the input data, AgriAdapt provides:
  - Alternative crop recommendations tailored to the environmental factors.

- **Features**:
  - Displays detailed explanations for each recommendation.
  - Highlights crops that are most likely to yield higher profits and sustainability.

- **Soil Preparation**: Based on the input data, AgriAdapt provides:
  - Different soil preparation techniques to increase the yield for the input crop.
  - If the crop is not suitable to grow in the given conditions, recommendations for making the soil compatible for growth

- **Features**:
  - Displays detailed explanations for each recommendation.
  - Highlights techniques which can be easily implementated

- **Crop Species Alternatives**: Based on the input data, AgriAdapt provides:
  - Crop species (varieties) recommendations which are suitable to the climate and soil conditions.

- **Features**:
  - Displays detailed explanations for each recommendation.


### 3. Action Panel
- **Soil Preparation & Fertilizer Advice**: After receiving recommendations, users can:
  - Access tailored soil preparation techniques.
  - View fertilizer suggestions to enhance growth.

- **Market Insights**: This panel includes:
  - Live market prices for suggested crops.
  - Alerts for potential market fluctuations to help farmers make timely decisions.

By navigating through these three panels, users can effectively utilize AgriAdapt to enhance their farming practices and make informed decisions for sustainable agriculture.


---

## AI Integration

AgriAdapt leverages GPT-4 models to deliver precise, data-backed agricultural recommendations. Below is a table detailing how GPT-4o and GPT-4o Mini are used in AgriAdapt:

| **Feature**                     | **GPT-4o**                                                                                       | **GPT-4o Mini**                                                                                   |
|---------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Input Panel (Soil Analysis)**                 | - Analyzes soil images and health data for comprehensive input analysis. <br> - Gather the location details from the device's location. <br> - Gather the climate from the location details. | - Provides basic analysis of soil images.<br> -  OCR:extracts data from the soil health card for faster recommendations.       |
| **Crop Alternatives**           | - Suggests alternative crops based on environmental factors and input data. <br> - Integrates detailed climate, soil nutrient and sustainability analysis. | |
| **Soil Preparation**            | - Recommends detailed soil preparation techniques for optimal yield based on the soil analysis previously done. <br> - Offers advice on soil compatibility for unsuitable crops. |  |
| **Crop Species Alternatives**    | - Offers comprehensive recommendations for crop varieties based on climate and soil conditions. <br> - Includes in-depth analysis for each variety. | |
| **Realtime Market Prices**    | - Offers realtime prices for the crop species if available, if not then provides historic data. | |
| **Fertilizer Recommendation**    | - Offers fertilizer recommendations based on the soil conditions. <br> - Includes in-depth details for each fertilizer. | |

Each model optimizes processing depth and speed to serve diverse user needs and connectivity levels.

**API Calls and Datasets**:
- [GPT-4o-mini](https://platform.openai.com/docs/models/gpt-4o-mini) API is used for image processing.
- [GPT-4o](https://platform.openai.com/docs/models/gpt-4o) API for text generation, data analysis and recommendations
- [Open Government Data (OGD) Platform API](https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi) for fetching daily prices from the markets across India
-[Government of India
Department of Agriculture and Farmers Welfare Dataset](https://soilhealth.dac.gov.in/piechart
)dataset for soil profiles for all states of India
---

## Prototype/Working Solution
AgriAdapt includes a fully functional prototype that can be deployed locally or accessed via our deployed URL:
[Deployed URL](https://agriadapt-1.onrender.com/)

For a local setup, follow the instructions in the [Project Setup](#project-setup) section.

---

## Innovation & Originality
AgriAdapt stands out due to its comprehensive, AI-powered approach that integrates local agricultural insights with cutting-edge AI technology. Unlike traditional advisory services or generic agricultural apps, AgriAdapt uses GPT-4o’s advanced language and analytical abilities to provide highly contextualized recommendations tailored to each farmer’s unique environmental conditions. Here are the key innovations that set AgriAdapt apart:

1. **Personalized, Data-Driven Recommendations**  
   AgriAdapt’s use of GPT-4o allows it to analyze real-time climate and soil data, to deliver customized guidance. It goes beyond simple crop recommendations by suggesting specific soil preparation techniques and fertilizers, making it a comprehensive farming advisor.

2. **Alternative Crop Suggestions Based on Market Viability**  
   Farmers can view crop alternatives that may be more resilient or profitable based on changing market and climate conditions. GPT-4o dynamically evaluates the farmer’s conditions  to recommend viable alternatives, a unique feature rarely seen in other agricultural platforms.

3. **Open-Source Accessibility**  
   AgriAdapt is developed as an open-source project, inviting contributions from the broader developer and agricultural community.

4. **User-Centric, Intuitive Interface**  
   Designed with accessibility in mind, AgriAdapt features a simplified interface to cater to users with limited technical experience. With minimal input required from the farmers, they can easily navigate the platform, making AI-driven insights accessible in rural areas.

---

## Team Roles
- **[Saikat Sahana](https://github.com/saikatsahana77)** - Frontend Developer & UI/UX Designer
- **[Spurthi Bhat](https://github.com/Spurthi7768)** - Backend Developer

---

## Optional Features

### Open Source Contribution
AgriAdapt is open source, allowing developers to contribute and adapt the tool for different agricultural contexts worldwide.


### AI Ethics Consideration
We prioritize responsible AI use by:
- Ensuring unbiased, data-driven recommendations.
- Protecting user data with not storing the data while running the solution.
- Enhancing transparency by explaining recommendations to build user trust.

