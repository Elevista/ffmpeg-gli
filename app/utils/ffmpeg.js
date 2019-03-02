import childProcess from 'child_process'
import Deferred from './Deferred'
import { remote } from 'electron'

const types = { V: [], A: [], S: [] }
const formats = { D: [], E: [] }
export const demuxers = formats.D
export const muxers = formats.E
try {
  _.chain(childProcess.execSync('ffmpeg -encoders')).toString().split(/--+/).get(1).split('\n').forEach(x => {
    const res = /^ (V|A|S)[\w.]+ ([\w]+)[ ]+(.+)/.exec(x)
    if (!res) return
    const [, type, name, info] = res
    _(types[type]).push({ name, info }).value()
  }).value()
  _.chain(childProcess.execSync('ffmpeg -formats')).toString().split(/--+/).get(1).split('\n').forEach(x => {
    const res = /^ ([\w ]{2}) ([\w,]+)[ ]+(.+)/.exec(x)
    if (!res) return
    const [, [D, E], names, info] = res
    names.split(',').forEach(name => {
      if (D === 'D') formats.D.push({ name, info })
      if (E === 'E') formats.E.push({ name, info })
    })
  }).value()
} catch (e) {
  remote.dialog.showMessageBox({
    type: 'error',
    title: 'FFmpeg GLI',
    message: `Failed to get FFmpeg information.
Please check "ffmpeg" command exist.
(Support FFmpeg 4.* version)`
  })
  remote.getCurrentWindow().close()
}

export const encoders = { Video: types.V, Audio: types.A, Subtitle: types.S }
export function spawn (args) {
  const deferred = new Deferred()
  const ffmpeg = childProcess.spawn('ffmpeg', _.flattenDeep(args))
  let progress = () => {}
  let started = false
  let out
  const log = []
  ffmpeg.stderr.on('data', data => {
    out = data.toString()
    if (!started) started = /Press.+help.*/.test(out)
    if (started) {
      const p = _(out.match(/([^ ]+)=[ ]*([^ ,]+)/g)).map(x => x.split(/=[ ]*/)).fromPairs().value()
      if (p.speed || p.time) progress(p)
    }
    log.push(out)
  })
  ffmpeg.on('exit', (code, signal) => {
    const fullLog = log.join('\n')
    if (code === 0) return deferred.resolve({ code, fullLog, signal })
    const message = _.get(fullLog.match(/\[[^\]@]+@[^\]]+\][ ]*(.+)$/m), 1) || _.get(out.trim().match(/.+$/), 0)
    const error = _.get(fullLog.match(/^Error.+/m), 0)
    deferred.reject({ code, message, error, fullLog, signal })
  })
  deferred.kill = v => { ffmpeg.kill(v); deferred.reject(false) }
  deferred.progress = cb => { progress = cb; return deferred }
  return deferred
}
export default function ffmpeg (...args) {
  const ffmpeg = childProcess.spawn('ffmpeg', _.flattenDeep(args))
  const deferred = new Deferred()
  const log = []
  ffmpeg.stderr.on('data', data => log.push(data))
  ffmpeg.on('exit', (code, signal) => deferred.resolve(log.join('\n')))
  return deferred.promise
}
