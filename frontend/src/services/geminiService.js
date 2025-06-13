import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const defaultReliableSources = [
  "Mayo Clinic (www.mayoclinic.org)",
  "WebMD (www.webmd.com)",
  "Centers for Disease Control and Prevention (www.cdc.gov)",
  "World Health Organization (www.who.int)",
  "National Institutes of Health (www.nih.gov)"
];

export const getMedicalDiagnosis = async (prompt) => {
  try {
    console.log("Request prompt:", prompt);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const requestPayload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        const result = await model.generateContent(requestPayload);
        const response = await result.response;
        const text = response.text();
        
        console.log("Raw response from Gemini:", text);

        try {
          const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
          console.log("Cleaned response text:", cleanedText);
          
          const diagnosisData = JSON.parse(cleanedText);
          
          if (!diagnosisData.result) {
            throw new Error("Missing result field in response");
          }

          if (diagnosisData.result.analysis?.possibleConditions) {
            if (!diagnosisData.result.analysis.possibleConditions.length) {
              throw new Error("No possible conditions provided");
            }
          } else if (diagnosisData.result.healthAssessment) {
            if (!diagnosisData.result.healthAssessment.overview || 
                !diagnosisData.result.healthAssessment.keyAreas || 
                !diagnosisData.result.healthAssessment.riskFactors) {
              throw new Error("Missing required health assessment fields");
            }
          } else {
            throw new Error("Invalid response format");
          }

          if (!diagnosisData.disclaimer) {
            diagnosisData.disclaimer = "This analysis is provided for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
          }

          if (!diagnosisData.result?.educationalResources?.medicalTerminology) {
            diagnosisData.result.educationalResources = {
              ...diagnosisData.result.educationalResources,
              medicalTerminology: {}
            };
          }

          if (!diagnosisData.result?.educationalResources?.reliableSources || 
              diagnosisData.result.educationalResources.reliableSources.length === 0) {
            diagnosisData.result.educationalResources.reliableSources = defaultReliableSources;
          }

          console.log("Parsed diagnosis data:", diagnosisData);
          return diagnosisData;
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          console.error("Failed to parse text:", text);
          throw new Error("Invalid response format from AI model");
        }
      } catch (error) {
        lastError = error;
        if (error.message.includes("429") || error.message.includes("quota")) {
          console.log(`Rate limit hit, retrying in 60 seconds... (${retries} attempts left)`);
          await delay(60000);
          retries--;
        } else {
          throw error;
        }
      }
    }

    throw lastError || new Error("Failed after multiple retries");
  } catch (error) {
    console.error("Error getting diagnosis:", error);
    if (error.message.includes("API key")) {
      throw new Error("Invalid or missing API key. Please check your configuration.");
    } else if (error.message.includes("429") || error.message.includes("quota")) {
      throw new Error("Free tier rate limit exceeded. Please try again in a few minutes.");
    } else if (error.message.includes("404")) {
      throw new Error("Model not found. Please check your API configuration.");
    } else {
      throw new Error("Failed to get diagnosis. Please try again later.");
    }
  }
};