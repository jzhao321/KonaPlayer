export interface MediaItems{
  streamUrl: string
}

export interface ConfigType {
  mediaItems: MediaItems[],
  autoPlay: boolean,
  mute: boolean,
  loop: boolean,
  continuousPlay: boolean
}
