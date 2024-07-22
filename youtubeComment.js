import { google } from "googleapis";
import fs from "fs";
import { dbConnect } from "./db.js"; 
import { YOUTUBE_GOOGLE_API } from "./constent.js";


const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_GOOGLE_API,
});

async function create({ connection, comment }) {
  const [results] = await connection.execute(
    "INSERT INTO comments (commentid,commenter,comment,gpt,flag,respond) VALUES (?,?,?,?,?,?)",
    [
      comment.commentid,
      comment.commenter,
      comment.comment,
      comment.gpt,
      comment.flag,
      comment.respond,
    ]
  );
  return results.insertId;
}

const getYoutubeComments = async () => {
  return new Promise((resolve, reject) => {
    youtube.commentThreads.list(
      {
        part: "snippet",
        videoId: "xrj3zzaqODw",
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
  let comments=await getYoutubeComments();
  for (let i=0; i<comments.length; i++) {
    const id = await create({
      connection,
      comment: {
        commentid: comments[i].id,
        commenter: comments[i].snippet.topLevelComment.snippet.authorDisplayName || "",
        comment: comments[i].snippet.topLevelComment.snippet.textOriginal || "",
        gpt: "",
        flag: 0,
        respond: 0,
      },
    });
    console.log(`Inserted row id is: ${id}`);
  }
};

const main = async () => {
  const connection = await dbConnect();

  try {
    await createComments(connection);
  }catch{
    console.log("error creating comments")
  } finally {
    await connection.end();
  }
};

main();
