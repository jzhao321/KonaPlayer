import KonaPlayerEvent from '@enums/KonaPlayerEvents.enum';
import { ConfigType } from '@interfaces/config.interface';
import { JSDOM } from 'jsdom';
import KonaPlayer from './KonaPlayer';

const mockHTML = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kona Player</title><meta name="description" content="The HTML5 Herald"><meta name="author" content="James Zhao"><link rel="stylesheet" href="sheet.css"></head><body><div id="root"></div><div id="buttons"></div><script src="kona-player.js"></script></body></html>';

const dom = new JSDOM(mockHTML);
const { window: { document } } = dom;

global.document = dom.window.document;
global.window = dom.window as unknown as Window & typeof globalThis;

const mockConfig: ConfigType = {
  autoPlay: true,
  continuousPlay: true,
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
};

describe('KonaPlayer', () => {
  let player: KonaPlayer;
  let videoElement: HTMLVideoElement;

  const setupTests = (config: ConfigType) => {
    player = new KonaPlayer(config);
    player.render('#root');
    videoElement = document.querySelector<HTMLVideoElement>('#konaplayer');
    videoElement.play = jest.fn();
    videoElement.load = jest.fn();
  };

  beforeEach(() => {
    setupTests(mockConfig);
  });

  afterEach(() => {
    document.querySelector('#root').innerHTML = '';
  });

  describe('Constructor', () => {
    it('initializes correctly', () => {
      expect(player).not.toBeFalsy();
    });
  });
  describe('Subscribe / Event Listeners', () => {
    it('Works when "play" is called', () => {
      const playMock = jest.fn();
      player.subscribe(KonaPlayerEvent.STARTED, playMock);
      videoElement.dispatchEvent(new window.Event('play'));
      expect(playMock).toBeCalledTimes(1);
    });
    it('Works when "ended" is called', () => {
      const endedMock = jest.fn();
      player.subscribe(KonaPlayerEvent.ENDED, endedMock);
      videoElement.dispatchEvent(new window.Event('ended'));
      expect(endedMock).toBeCalledTimes(1);
    });
    it('Works when "play" has multiple listeners', () => {
      const playMock = jest.fn();
      player.subscribe(KonaPlayerEvent.STARTED, playMock);
      player.subscribe(KonaPlayerEvent.STARTED, playMock);
      player.subscribe(KonaPlayerEvent.STARTED, playMock);
      videoElement.dispatchEvent(new window.Event('play'));
      expect(playMock).toBeCalledTimes(3);
    });
    it('Works when "ended" has multiple listeners', () => {
      const endedMock = jest.fn();
      player.subscribe(KonaPlayerEvent.ENDED, endedMock);
      player.subscribe(KonaPlayerEvent.ENDED, endedMock);
      player.subscribe(KonaPlayerEvent.ENDED, endedMock);
      videoElement.dispatchEvent(new window.Event('ended'));
      expect(endedMock).toBeCalledTimes(3);
    });
  });
  describe('Render', () => {
    let sourceElement: HTMLSourceElement;

    beforeEach(() => {
      setupTests(mockConfig);
      sourceElement = document.querySelector('#videoSrc');
    });

    it('Renders the video element', () => {
      expect(videoElement).not.toBeFalsy();
    });

    it('Sets the video attributes correctly', () => {
      expect(videoElement.loop).toBeFalsy();
      expect(videoElement.autoplay).toBe(mockConfig.autoPlay);
      expect(videoElement.muted).toBe(mockConfig.mute);
    });

    it('Generates the source element', () => {
      expect(sourceElement).not.toBeFalsy();
    });

    it('Sets the source attributes correctly', () => {
      expect(sourceElement.src).toBe(mockConfig.mediaItems[0].streamUrl);
    });
  });
  describe('Play', () => {
    it('Calls play function in videoElement', () => {
      videoElement.play = jest.fn();
      player.play();
      expect(videoElement.play).toHaveBeenCalledTimes(1);
    });
    it('Sets currentTime in videoElement if startPosition is given', () => {
      const time = 2;
      player.play(time);
      expect(videoElement.currentTime).toBe(time);
    });
    it('Doesn\'t set currentTime if not given', () => {
      player.play();
      expect(videoElement.currentTime).toBe(0);
    });
  });
  describe('Pause', () => {
    it('Calls pause function in videoElement', () => {
      videoElement.pause = jest.fn();
      player.pause();
      expect(videoElement.pause).toHaveBeenCalledTimes(1);
    });
  });
  describe('Next Item', () => {
    it('Calls play if only 1 video and Loop is true', () => {
      setupTests({
        ...mockConfig,
        mediaItems: [
          {
            streamUrl: 'asdf',
          },
        ],
        loop: true,
        continuousPlay: false,
      });
      jest.spyOn(player, 'play').mockImplementation();
      player.nextItem();
      expect(player.play).toHaveBeenCalledTimes(1);
    });
    it('Does nothing if only 1 video and Loop is false', () => {
      setupTests({
        ...mockConfig,
        mediaItems: [
          {
            streamUrl: 'asdf',
          },
        ],
        loop: false,
      });
      jest.spyOn(player, 'play').mockImplementation();
      jest.spyOn(videoElement, 'load').mockImplementation();
      player.nextItem();
      expect(player.play).toHaveBeenCalledTimes(0);
      expect(videoElement.load).toHaveBeenCalledTimes(0);
    });
    it('Loads new video and plays if more than 1 video and loop and continuousPlay is true', () => {
      setupTests({
        ...mockConfig,
        mediaItems: [
          {
            streamUrl: 'asdf',
          },
          {
            streamUrl: 'asdf2',
          },
        ],
        loop: true,
        continuousPlay: true,
      });
      jest.spyOn(player, 'play').mockImplementation();
      player.elements.videoElement.load = jest.fn();
      player.elements.videoElement.play = jest.fn();
      player.nextItem();
      expect(player.play).toHaveBeenCalledTimes(0);
      expect(player.elements.videoElement.load).toHaveBeenCalledTimes(1);
      expect(player.elements.videoElement.play).toHaveBeenCalledTimes(1);
    });
    it('Loads new video but doesnt play if more than 1 video and loop and continuousPlay are false', () => {
      setupTests({
        ...mockConfig,
        mediaItems: [
          {
            streamUrl: 'asdf',
          },
          {
            streamUrl: 'asdf2',
          },
        ],
        loop: false,
        continuousPlay: false,
      });
      jest.spyOn(player, 'play').mockImplementation();
      player.elements.videoElement.load = jest.fn();
      player.elements.videoElement.play = jest.fn();
      player.nextItem();
      expect(player.play).toHaveBeenCalledTimes(0);
      expect(player.elements.videoElement.load).toHaveBeenCalledTimes(1);
      expect(player.elements.videoElement.play).toHaveBeenCalledTimes(0);
    });
  });
});
