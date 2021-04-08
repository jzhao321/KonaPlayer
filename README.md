# KonaPlayer

# How to run
 This project uses Yarn 2.

 Install yarn if you dont have it already
 ```
 npm install -g yarn
 ```
 Note: you might have to refresh the terminal to use yarn
 
 After installing yarn, run this in the repo to use yarn 2
 ```
 yarn set version berry
 ```
 After setting up yarn 2, install packages by running just this
 ```
 yarn
 ```
 After installing the packages, run this to compile the app
 ```
 yarn start
 ```
 After compiling, run this to serve the files using http-server
 ```
 yarn serve
 ```
 The default configuration for the application is
 ```
 {
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
  }
 ```

