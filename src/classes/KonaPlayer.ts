import { ConfigType } from '@interfaces/config.interface';
import KonaPlayerEvent from '@enums/KonaPlayerEvents.enum';

export default class KonaPlayer {
  state: {
    callbackArray: {
      [key: string]: (() => void)[]
    },
    started: boolean,
    videoIndex: number
  }

  config: ConfigType;

  elements: {
    videoElement: HTMLVideoElement,
    sourceElement: HTMLSourceElement,
  }

  constructor(playerConfig: ConfigType) {
    this.config = playerConfig;
    this.state = {
      callbackArray: {},
      started: false,
      videoIndex: 0,
    };
    this.elements = {
      videoElement: document.createElement('video'),
      sourceElement: document.createElement('source'),
    };
    this.elements.videoElement.addEventListener('play', () => {
      this._runCallbacks(KonaPlayerEvent.STARTED);
    });
    this.elements.videoElement.addEventListener('ended', () => {
      this._runCallbacks(KonaPlayerEvent.ENDED);
      this.nextItem();
    });
  }

  render = (selector: string): void => {
    const divToRenderIn = document.querySelector<HTMLDivElement>(selector);

    // Video Element
    this.elements.videoElement.autoplay = this.config.autoPlay;
    this.elements.videoElement.muted = this.config.mute;
    this.elements.videoElement.controls = true;

    // Source Element
    this.elements.sourceElement.setAttribute('src', this.config.mediaItems[this.state.videoIndex].streamUrl);
    this.elements.sourceElement.setAttribute('type', 'video/webm');

    // Rendering Video Elements
    divToRenderIn.appendChild(this.elements.videoElement);
    this.elements.videoElement.appendChild(this.elements.sourceElement);
  }

  play = (startPosition?: number): void => {
    if (startPosition) {
      this.elements.videoElement.currentTime = startPosition;
    }
    this.elements.videoElement.play();
  }

  pause = (): void => {
    this.elements.videoElement.pause();
  }

  /**
   * Behavior as intended:
   * If only 1 video is in mediaItems and Loop is true, will replay the video
   * If only 1 video is in mediaItems and Loop is false, will stop after video ends
   * If any video except last is played, and Loop and Continuous Play is true, will move on to next video
   * If any video except is played, and Loop and Continuous Play is false, will stop after video
   * If last video is played, and Loop and Continuous Play is true, will loop back to first video
   * If last video is played, and Loop and Continuous play is false, will stop after last video
   */
  nextItem = (): void => {
    if (this.config.mediaItems.length > 1 && this.config.loop && this.config.continuousPlay) {
      // Checks if the it's the last video
      if (this.state.videoIndex >= this.config.mediaItems.length - 1) {
        this.state.videoIndex = 0;
      } else {
        this.state.videoIndex += 1;
      }

      this.elements.sourceElement.src = this.config.mediaItems[this.state.videoIndex].streamUrl;

      this.elements.videoElement.load();

      // Plays the new video immediately if continuousPlay is true
      this.config.continuousPlay && this.elements.videoElement.play();
    } else if (this.config.loop) {
      this.play();
    }
  }

  /**
   * Takes a callback function, and adds it to an array of callback functions that triggers
   * when a specific event occurs
   * @param eventName Event to subscribe to
   * @param callback Function called when event occurs
   */
  subscribe = (eventName: KonaPlayerEvent, callback: () => void): void => {
    if (this.state.callbackArray[eventName] && Array.isArray(this.state.callbackArray[eventName])) {
      this.state.callbackArray[eventName].push(callback);
    }
    this.state.callbackArray[eventName] = [callback];
  }

  /**
   * Helper fucntion to execute callback arrays
   * @param event Event ID for which callback array to execute
   */
  private _runCallbacks = (event: KonaPlayerEvent) => {
    this.state.callbackArray[event] ?? this.state.callbackArray[event].forEach((instance) => {
      instance();
    });
  }
}
