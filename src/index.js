const fs = require('fs');
const { exit } = require('process');

const env = require('./environment-variables');
const { getVideoInfo, downloadThumbnail, downloadAudio } = require('./youtube-yt-dlp');
const { postEpisode } = require('./anchorfm-pupeteer');

function validateYoutubeVideoId(json) {
  if (json.id === undefined || json.id === null || typeof json.id !== 'string') {
    throw new Error('Id not present in JSON');
  }
}

function getYoutubeVideoId(path) {
  try {
    const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
    validateYoutubeVideoId(json);
    return json.id;
  } catch (err) {
    throw new Error(`Unable to get youtube video id: ${err}`);
  }
}

async function main() {
  const dirPath = './videos/';

  const files = fs.readdirSync(dirPath);
  console.log('files:',files)

  const arr = []
  files.forEach(async (val, i) => {
  
//     const youtubeVideoId = getYoutubeVideoId(path.join(dirPath, val));
    console.log('this file is:',val)
    if (val.includes(".json")){
      const youtubeVideoId =val.replace(".json","");

      const youtubeVideoInfo = await getVideoInfo(youtubeVideoId);
      const { title, description, uploadDate } = youtubeVideoInfo;
      console.log(`title: ${title}`);
      console.log(`description: ${description}`);
      console.log(`Upload date: ${JSON.stringify(uploadDate)}`);

      await Promise.all([downloadThumbnail(youtubeVideoId), downloadAudio(youtubeVideoId)]);

      console.log('Posting episode to anchorfm');
      await postEpisode(youtubeVideoInfo);
      try {
        const fileName = 'progress.txt'
        fs.appendFileSync(fileName, youtubeVideoId+',', 'utf-8');
      } catch(err) {
        console.log('Error appending data to file in sync mode', err);
    }      
      
      
    }

    
    
})
                }

main()
  .then(() => console.log('Finished successfully.'))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
