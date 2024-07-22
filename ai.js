import OpenAI from "openai";
import axios from "axios";
import { API_KEY, ORGANIZATION_KEY } from "./constent";

const ORGANIZATION_KEY = ORGANIZATION_KEY;
const API_KEY = API_KEY;

const openai = new OpenAI({
    apiKey: API_KEY,
  });
  async function getResponse(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100, 
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
      throw error;
    }
  }
  
  getResponse('What is the capital of France?').then(response => {
    console.log('Response:', response);
  });

