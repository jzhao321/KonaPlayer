import KonaPlayerEvent from '@enums/KonaPlayerEvents.enum';
import KonaPlayer from './classes/KonaPlayer';

document.addEventListener('DOMContentLoaded', () => {
  const player = new KonaPlayer({
    autoPlay: false,
    loop: true,
    mediaItems: [
      {
        streamUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
      },
      {
        streamUrl: 'https://ve.media.tumblr.com/tumblr_q1qj23CdxU1rv6iid_480.mp4',
      },
    ],
    mute: true,
    continuousPlay: true,
  });
  player.subscribe(KonaPlayerEvent.STARTED, () => {
    console.log('Started playback');
  });
  player.subscribe(KonaPlayerEvent.ENDED, () => {
    console.log('Ended playback');
  });
  player.render('#root');

  // The following are buttons that help interact with the application
  const playButton = document.createElement('button');
  const pauseButton = document.createElement('button');
  const nextItemButton = document.createElement('button');

  // Play Button
  playButton.id = 'play';
  playButton.textContent = 'Play';
  playButton.onclick = () => {
    player.play();
  };

  // Pause Button
  pauseButton.id = 'pause';
  pauseButton.textContent = 'Pause';
  pauseButton.onclick = () => {
    player.pause();
  };

  // Next Item Button
  nextItemButton.id = 'nextitem';
  nextItemButton.textContent = 'Next Item';
  nextItemButton.onclick = () => {
    player.nextItem();
  };

  const buttonDiv = document.querySelector('#buttons');

  buttonDiv.appendChild(playButton);
  buttonDiv.appendChild(pauseButton);
  buttonDiv.appendChild(nextItemButton);
}, false);
