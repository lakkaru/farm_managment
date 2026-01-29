# OpenAI Disease Detection Setup Guide

## Overview
The farm management system now supports AI-powered rice plant disease detection using OpenAI's GPT-4 Vision API. This provides accurate, real-time disease identification from uploaded images.

## Features

### OpenAI Integration
- **Real AI Analysis**: Uses GPT-4 Vision to analyze rice plant images
- **Comprehensive Detection**: Identifies diseases, pests, and nutritional deficiencies
- **Expert Recommendations**: Provides treatment and prevention advice
- **Fallback System**: Automatically falls back to traditional detection if OpenAI is unavailable

### Detected Conditions
1. **Major Diseases**:
   - Rice Blast (Pyricularia oryzae)
   - Bacterial Leaf Blight (Xanthomonas oryzae)
   - Sheath Blight (Rhizoctonia solani)
   - Brown Spot (Bipolaris oryzae)
   - False Smut (Ustilaginoidea virens)
   - Bakanae (Gibberella fujikuroi)
   - Rice Tungro Virus
   - And more...

2. **Nutritional Deficiencies**:
   - Nitrogen (N) deficiency
   - Potassium (K) deficiency
   - Phosphorus (P) deficiency
   - Zinc (Zn) deficiency
   - Iron (Fe) toxicity

## Setup Instructions

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the API key (you won't be able to see it again!)

### Step 2: Configure Environment Variable

Add your OpenAI API key to the backend `.env` file:

```bash
# Open the .env file
cd backend
# Edit the file and add:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Important**: 
- Replace `sk-proj-xxxxxxxxxxxxxxxxxxxxx` with your actual API key
- Never commit your API key to version control
- The `.env` file should already be in `.gitignore`

### Step 3: Restart the Backend Server

```bash
cd backend
npm run dev
```

The system will automatically detect the API key and use OpenAI for disease detection.

## How It Works

### Analysis Flow

1. **User uploads image** → Frontend sends to `/api/disease-detection/analyze`
2. **OpenAI Check** → System checks if OpenAI API key is configured
3. **Image Analysis**:
   - **If OpenAI available**: Uses GPT-4 Vision for analysis
   - **If OpenAI unavailable**: Falls back to reference matching or simulated detection
4. **Results Enhancement** → Combines AI results with local disease database
5. **Response** → Returns detailed analysis with recommendations

### OpenAI Service Features

- **Smart Prompting**: Uses expert agricultural prompts for accurate detection
- **JSON Parsing**: Validates and structures AI responses
- **Error Handling**: Graceful fallback if API fails
- **Token Usage Tracking**: Monitors API usage and costs

### Response Format

```json
{
  "success": true,
  "data": {
    "isHealthy": false,
    "healthScore": 65,
    "imageQuality": "good",
    "diseases": [
      {
        "id": 1,
        "name": "Bacterial Leaf Blight",
        "scientificName": "Xanthomonas oryzae",
        "confidence": 87,
        "severity": "high",
        "affectedAreas": ["leaf", "stem"],
        "symptoms": ["Yellow stripes", "Wilting"],
        "description": "...",
        "treatment": ["Apply copper-based fungicides", "..."],
        "prevention": ["Use certified seeds", "..."]
      }
    ],
    "nutritionalDeficiencies": [],
    "recommendations": [
      "Immediate treatment required",
      "Consult agricultural expert",
      "..."
    ],
    "urgency": "immediate",
    "analysisMetadata": {
      "modelVersion": "OpenAI GPT-4 Vision",
      "analysisMethod": "openai_vision",
      "aiProvider": "OpenAI",
      "tokensUsed": 1234
    }
  }
}
```

## Cost Considerations

### OpenAI Pricing (as of 2024)
- **GPT-4o**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens
- **GPT-4o-mini**: Lower cost alternative, still accurate
- **Typical Usage**: ~1500 tokens per image analysis (~$0.02-0.05 per analysis)

### Cost Optimization
1. Use GPT-4o-mini for basic detection
2. Implement caching for similar images
3. Set monthly usage limits in OpenAI dashboard
4. Monitor usage through OpenAI platform

## Testing

### Test Without OpenAI
The system works without OpenAI by using simulated detection:
```bash
# Simply don't set OPENAI_API_KEY or set it to empty
OPENAI_API_KEY=
```

### Test With OpenAI
```bash
# Set your API key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# Upload test image via the frontend:
# 1. Login to dashboard
# 2. Click "Rice Plant Diseases" in Quick Actions
# 3. Upload a rice plant image
# 4. View AI-powered analysis results
```

## Troubleshooting

### Common Issues

**1. "OpenAI API key is not configured"**
- Solution: Add `OPENAI_API_KEY` to backend `.env` file

**2. "Failed to analyze image"**
- Check API key is valid
- Verify internet connection
- Check OpenAI service status
- View backend logs for detailed error

**3. "Rate limit exceeded"**
- OpenAI has rate limits based on your account tier
- Wait and retry, or upgrade your OpenAI account

**4. Analysis using "traditional_ai" instead of "openai_vision"**
- Check `analysisMetadata.analysisMethod` in response
- If not using OpenAI, check API key configuration
- View backend console logs for connection errors

### Debugging

Enable detailed logging:
```javascript
// In backend console, you'll see:
console.log('Using OpenAI Vision API for disease detection...')
// or
console.log('Using traditional disease detection method...')
```

## Security Best Practices

1. **Never expose API key**: Keep it in `.env` file only
2. **Use environment variables**: Never hardcode keys
3. **Rotate keys regularly**: Generate new keys periodically
4. **Monitor usage**: Set up alerts in OpenAI dashboard
5. **Implement rate limiting**: Prevent abuse of your endpoint

## Future Enhancements

- [ ] Image caching to reduce API calls
- [ ] Batch processing for multiple images
- [ ] Fine-tuning on rice disease dataset
- [ ] Confidence threshold configuration
- [ ] Alternative AI providers (Google Vision, Azure CV)
- [ ] Offline model support

## Support

For issues or questions:
1. Check backend logs: `npm run dev`
2. Review OpenAI dashboard for API status
3. Test with `.env.example` configuration
4. Verify network connectivity to OpenAI API

## Resources

- [OpenAI Platform](https://platform.openai.com/)
- [GPT-4 Vision Documentation](https://platform.openai.com/docs/guides/vision)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Pricing](https://openai.com/pricing)
