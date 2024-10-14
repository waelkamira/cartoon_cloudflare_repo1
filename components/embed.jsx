import React, { useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/forest/index.css';

const TeraboxPlayer = ({ teraboxUrl }) => {
  const [videoData, setVideoData] = useState(null);

  const fetchVideoData = async (url) => {
    const id = url.split('/').pop();
    const response = await fetch(
      `https://wholly-api.skinnyrunner.com/get/website-data.php?get_html=https://www.terabox.tech/api/yttera?id=${id}`
    );
    const data = await response.json();
    const videoData = data.response[0];

    setVideoData({
      title: videoData.title,
      thumbnail: videoData.thumbnail,
      fastDownload: videoData.resolutions['Fast Download'],
      hdDownload: videoData.resolutions['HD Video'],
      src: `https://apis.forn.fun/tera/data.php?id=${id}`,
    });
  };

  React.useEffect(() => {
    if (teraboxUrl) {
      fetchVideoData(teraboxUrl);
    }
  }, [teraboxUrl]);

  return (
    <div className="container">
      {videoData ? (
        <>
          <h2>{videoData.title}</h2>
          <div className="video">
            <iframe
              id="my-video"
              className="video-js vjs-theme-forest"
              controls
              preload="auto"
              width="640"
              height="264"
              data-setup="{}"
            >
              <source src={videoData.src} type="video/mp4" />
              <p className="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="https://videojs.com/html5-video-support/"
                  target="_blank"
                >
                  supports HTML5 video
                </a>
              </p>
            </iframe>
          </div>
          <div className="details">
            <a
              rel="noreferrer noopener"
              href={videoData.fastDownload}
              target="_blank"
            >
              Fast Download
            </a>
            <a
              rel="noreferrer noopener"
              href={videoData.hdDownload}
              target="_blank"
            >
              HD Video
            </a>
            {/* <img src={videoData.thumbnail} alt="Thumbnail" /> */}
          </div>
        </>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default TeraboxPlayer;
