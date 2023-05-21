import json
import yt_dlp
import os
mode=os.getenv('MODE')
URL = os.getenv('URL')
# URL = 'https://www.youtube.com/c/DailyDoseComedy100'
if not os.path.exists('./videos'):
    os.makedirs('videos')
if '/c/' in URL or '/@' in URL or '/channel/' in URL:
    # ℹ️ See help(yt_dlp.YoutubeDL) for a list of available options and public functions
    ydl_opts = {
            # 'outtmpl': videopath+'/%(title)s'+'.mp4',
            'format': 'best',
#             'proxy': 'socks5://127.0.0.1:1080',
            # 'writesubtitles': 'true',
            # 'subtitleslangs': 'en', 
            # 'postprocessors': [{ # Embed metadata in video using ffmpeg. 'key': 'FFmpegMetadata', 'add_metadata': True, }, { # Embed thumbnail in file 'key': 'EmbedThumbnail', 'already_have_thumbnail': False, }
            # 'postprocessors': [{
            #     # Embed metadata in video using ffmpeg.
            #     # ℹ️ See yt_dlp.postprocessor.FFmpegMetadataPP for the arguments it accepts
            #     'key': 'FFmpegMetadata',
            #     'add_chapters': True,
            #     'add_metadata': True,
            # }],
            # 'logger': MyLogger(),
            # 'progress_hooks': [my_hook],
        }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(URL, download=False)
        channel_id=info['channel_id']

        if not os.path.exists('./videos/'+channel_id):
            os.makedirs('videos/'+channel_id)
    for entry in info['entries']:
        data={'id':entry['id']}
        json_obj = json.dumps(data)
        with open('./videos/'+channel_id+'/'+entry['id']+"episode.json", "w") as file:
            file.write(json_obj)
