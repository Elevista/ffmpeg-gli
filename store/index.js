import Vuex from 'vuex'
import Vue from 'vue'

const store = () => new Vuex.Store({
  state: {
    inputs: [],
    outputs: [],
    selectedElement: null,
    inputDir: '',
  },
  mutations: {
    addInput (state, input) {
      state.inputs.push(input)
    },
    removeInput (state, idx) {
      state.inputs.splice(idx, 1)
      const each = element => {
        element.streams.forEach(stream => {
          if (stream.input >= idx) stream.input--
        })
      }
      state.outputs.forEach(each)
      state.inputs.forEach(each)
    },
    assignInput (state, [input, assign]) {
      Object.assign(input, assign)
    },
    setOutputs (state, outputs) {
      state.outputs = outputs
    },
    assignOutput (state, [output, assign]) {
      Object.assign(output, assign)
    },
    setOutputItem (state, [idx, output]) {
      state.outputs[idx] = output
      state.outputs.push() // trigger array observer
    },
    addOuput (state, output) {
      state.outputs.push(output)
    },
    removeOutput (state, output) {
      const idx = state.outputs.indexOf(output)
      state.outputs.splice(idx, 1)
    },
    setInputDir (state, dir) { state.inputDir = dir },
    setSelectedElement (state, item) {
      state.selectedElement = item
    },
    setOption (state, [ options, option, value ]) {
      if (value) Vue.set(options, option, value)
      else Vue.delete(options, option)
    }
  }
})

export default store
