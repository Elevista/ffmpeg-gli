import { encoders } from '~/utils/ffmpeg'
export default {
  Output: [
    {
      option: '-ss',
      name: 'Start time',
      info: 'set the start time offset',
      type: 'Duration',
    },
    {
      option: '-to',
      name: 'End time',
      info: 'Stop writing the output or reading the input at position.',
      type: 'Duration',
    },
    {
      option: '-fs',
      name: 'File size',
      info: 'set the limit file size in bytes',
      type: 'Number',
    },
    {
      option: '-sseof',
      name: 'From end time',
      info: 'set the start time offset relative to EOF',
      type: 'Duration',
    },
    {
      option: '-t',
      name: 'Duration',
      info: 'record or transcode "duration" seconds of audio/video',
      type: 'Duration',
    },
    {
      option: '-dn',
      name: 'Diable data',
      info: 'diable data',
      type: null,
    },
    {
      option: '-pre',
      name: 'Preset',
      info: 'preset name',
      type: 'preset',
    },
    {
      option: '-timestamp',
      name: 'Timestamp',
      info: 'set the recording timestamp (\'now\' to set the current time)',
      type: 'Date',
    },
  ],
  Stream: {
    Video: [
      {
        option: '-c',
        name: 'Codec',
        info: 'codec',
        type: 'Select',
        options: [{ name: 'copy', info: 'Direct copy' }, ...encoders.Video],
      },
      {
        option: '-r',
        name: 'Frame rate',
        info: 'set frame rate (Hz value, fraction or abbreviation)',
        type: 'Number',
      },
      {
        option: '-b',
        name: 'Bitrate',
        info: 'video bitrate',
        type: 'Bitrate',
      },
      {
        option: '-q',
        name: 'Quality',
        info: 'set video quality (codec-specific)',
        type: 'Number',
      },
      {
        option: '-s',
        name: 'Size(WxH)',
        info: 'set frame size (WxH or abbreviation)',
        type: 'Size',
      },
      {
        option: '-pass',
        name: 'Pass',
        info: 'select the pass number (1 to 3)',
        type: 'Select',
        options: [1, 2, 3].map(x => ({ name: x, info: `${x}` })),
      },
      {
        option: '-aspect',
        name: 'Aspect ratio',
        info: 'set aspect ratio (4:3, 16:9 or 1.3333, 1.7777)',
        type: 'Aspect',
      },
      {
        option: '-frames',
        name: 'Total frames',
        info: 'set the number of video frames to output',
        type: 'Number',
      },
      {
        option: '-metadata',
        name: 'Metadata',
        info: 'Set a metadata key/value pair.',
        type: 'Metadata',
        options: [{ name: 'rotate', info: 'Rotate' }]
      }

    ],
    Audio: [
      {
        option: '-c',
        name: 'Codec',
        info: 'codec',
        type: 'Select',
        options: [{ name: 'copy', info: 'Direct copy' }, ...encoders.Audio],
      },
      {
        option: '-r',
        name: 'Frame rate',
        info: 'set the audio sampling frequency',
        type: 'Number',
      },
      {
        option: '-b',
        name: 'Bitrate',
        info: 'audio bitrate (please use -b:a)',
        type: 'Bitrate',
      },
      {
        option: '-q',
        name: 'QualitQuality',
        info: 'set audio quality (codec-specific)',
        type: 'Number',
      },
      {
        option: '-frames',
        name: 'Total frames',
        info: 'set the number of audio frames to output',
        type: 'Number',
      },
      {
        option: '-ac',
        name: 'Audio channels',
        info: 'set number of audio channels',
        type: 'Number',
      },

    ],
    Subtitle: [
      {
        option: '-c',
        name: 'Codec',
        info: 'codec',
        type: 'Select',
        options: [{ name: 'copy', info: 'Direct copy' }, ...encoders.Subtitle],
      },

    ],
  },
}
