import { API_KEY } from "./constent.js";

const openAiHeader={
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
}


export const createEmbading=async(textToEmbed)=>{
let response=await fetch(`https://api.openai.com/v1/embeddings`,{
  method: 'POST',
  headers:openAiHeader,
  body:JSON.stringify({
    'model':'text-embedding-ada-002',
    'input':textToEmbed,
  })
});
if (response.ok) {
  const data = await response.json();
  return data; 
} else {
  throw new Error('Failed to create embedding');
}
};

// createEmbading("helo Words")



