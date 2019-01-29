export const types = {
  video: ['mp4', 'mkv', 'avi', 'ts', 'm4v', 'mpg', 'h264', 'hevc', 'flv'],
  audio: ['mp3', 'aac', 'm4a', 'mka', 'flac', 'ac3', 'wav', 'dts', 'ogg'],
  subtitle: ['srt', 'smi', 'sub', 'ass'],
}

export const exts = {
  video: types.video.map(x => `.${x}`),
  audio: types.audio.map(x => `.${x}`),
  subtitle: types.subtitle.map(x => `.${x}`),
}
export const filters = [
  { name: 'All files', extensions: ['*'] },
  {
    name: 'Media files',
    extensions: [...types.video, ...types.audio, ...types.subtitle],
  },
  { name: 'Video files', extensions: types.video },
  { name: 'Audio files', extensions: types.audio },
  { name: 'Subtitle files', extensions: types.subtitle },
]

export default types
