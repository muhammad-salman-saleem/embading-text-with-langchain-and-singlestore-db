import { dbConnect } from "./db.js"; 
import { createEmbading } from "./createEmbading.js";

const searchComments = async (connection, text) => {
  const vectordata = await createEmbading(text);
  const vector = vectordata.data[0].embedding;
  try {
    const [results] = await connection.execute(
      `SELECT text, DOT_PRODUCT(vector, JSON_ARRAY_PACK(?)) as score
       FROM myyoutubecomment
       ORDER BY score DESC
       LIMIT 5`,
      [JSON.stringify(vector)]
    );
    return results;
  } catch (error) {
    console.error("Error searching comments:", error);
    throw error;
  }
};

const main = async () => {
  const connection = await dbConnect();
  const text="Please make the  playlist on Figma templatre designe"
  try {
    const searchResults = await searchComments(connection, text);
    console.log("Search results:", searchResults);
  }catch{
    console.log("error creating comments")
  } finally {
    await connection.end();
  }
};

main();
