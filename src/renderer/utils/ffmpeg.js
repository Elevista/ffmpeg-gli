import childProcess from 'child_process'
import Deffered from './Deffered'

const types = { V: [], A: [], S: [] }
_.chain(childProcess.execSync('ffmpeg -encoders')).toString().split(/--+/).get(1).trim().split('\n').forEach(x => {
  const res = /([\w.]+) ([\w]+)[ ]+(.+)/.exec(x)
  if (!res) return
  const [, type, name, info] = res
  _(types[type[0]]).push({ name, info }).value()
}).value()

export const extensions = _.chain(childProcess.execSync('ffmpeg -muxers')).toString().split(/--+/).get(1).trim().split('\n').flatMap(x => {
  const res = /[ ]+E[ ]+([\w,]+)[ ]+(.+)/.exec(x)
  if (!res) return []
  const [, name, info] = res
  return name.includes(',') ? name.split(',').map(x => ({ name: x.trim(), info })) : [{ name, info }]
}).value()
export const encoders = { Video: types.V, Audio: types.A, Subtitle: types.S }
export function spawn (args) {
  const deffered = new Deffered()
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
    if (code === 0) return deffered.resolve({ code, fullLog, signal })
    const message = _.get(fullLog.match(/\[[^\]@]+@[^\]]+\][ ]*(.+)$/m), 1) || _.get(out.trim().match(/.+$/), 0)
    const error = _.get(fullLog.match(/^Error.+/m), 0)
    deffered.reject({ code, message, error, fullLog, signal })
  })
  deffered.kill = v => { ffmpeg.kill(v); deffered.reject(false) }
  deffered.progress = cb => { progress = cb; return deffered }
  return deffered
}
export default function ffmpeg (...args) {
  const ffmpeg = childProcess.spawn('ffmpeg', _.flattenDeep(args))
  const deffered = new Deffered()
  const log = []
  ffmpeg.stderr.on('data', data => log.push(data))
  ffmpeg.on('exit', (code, signal) => deffered.resolve(log.join('\n')))
  return deffered.promise
}
