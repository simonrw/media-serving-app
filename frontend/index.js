let videoElem = null;
let currentHls = null;

document.addEventListener('DOMContentLoaded', async () => {
  const res = await graphQLRequest("FetchItems",
    `
    query FetchItems {
      fetchItems {
        id
        name
        url
      }
    }
    `,
    {}
  );
  const { fetchItems: items } = res;

  const parent = document.getElementById("items");
  for (const item of items) {
    const liElem = document.createElement("li");

    const aElem = document.createElement("a");
    aElem.innerText = item.name;
    aElem.href = "#";
    aElem.dataset.url = item.url;
    aElem.addEventListener("click", loadVideo);
    liElem.appendChild(aElem);

    parent.appendChild(liElem);
  }
});

const loadVideo = (e) => {
  e.preventDefault();
  const url = e.target.dataset.url;

  // remove the old video videoElement
  if (videoElem) {
    currentHls.destroy();
    videoElem.remove();
    videoElem = null;
  }


  // create the new video element
  videoElem = document.createElement("video");
  videoElem.id = "current-video";
  videoElem.controls = true;
  videoElem.autoplay = true;
  videoElem.muted = true;
  videoElem.width = 640;

  const parent = document.getElementById("player-space");
  parent.appendChild(videoElem);
  currentHls = new Hls();
  currentHls.on(Hls.Events.MEDIA_ATTACHED, function() {
    console.log('video and hls.js are now bound together !');
  });
  currentHls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
    console.log(
      'manifest loaded, found ' + data.levels.length + ' quality level'
    );
  });
  currentHls.loadSource(url);

  currentHls.attachMedia(videoElem);
};
