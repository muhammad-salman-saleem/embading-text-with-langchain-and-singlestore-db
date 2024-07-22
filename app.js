import { google } from "googleapis";
import fs from "fs";
import { dbConnect } from "./db.js";
import { createEmbading } from "./createEmbading.js";
import { YOUTUBE_GOOGLE_API, YOUTUBE_VEDIO_ID } from "./constent.js";

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_GOOGLE_API,
});

async function create({ connection, comment }) {
  const [results] = await connection.execute(
    "INSERT INTO myyoutubecomment (text,vector) VALUES (?,JSON_ARRAY_PACK(?))",
    [comment.text, JSON.stringify(comment.vector)]
  );
  return results.insertId;
}

const getYoutubeComments = async () => {
  return new Promise((resolve, reject) => {
    youtube.commentThreads.list(
      {
        part: "snippet",
        videoId: YOUTUBE_VEDIO_ID,
        maxResults: 100,
      },
      (err, res) => {
        if (err) reject(err);
        let json = JSON.stringify(res.data.items);
        fs.writeFile("comments.json", json, "utf8", (err) => {
          if (err) throw err;
          console.log("The file has been saved successfully");
        });
        resolve(res.data.items);
      }
    );
  });
};

const createComments = async (connection) => {
  let comments = await getYoutubeComments();
  for (let i = 0; i < comments.length; i++) {
    const text = comments[i].snippet.topLevelComment.snippet.textOriginal;
    try {
      const vectordata = await createEmbading(text);
      const vector = vectordata.data[0].embedding;
      const id = await create({
        connection,
        comment: {
          text,
          vector,
        },
      });
      console.log(`Inserted row id is: ${id}`);
    } catch (error) {
      console.error(`Error processing comment ${i}:`, error);
    }
  }
};

const main = async () => {
  const connection = await dbConnect();

  try {
    await createComments(connection);
  } catch {
    console.log("error creating comments");
  } finally {
    await connection.end();
  }
};

main();
