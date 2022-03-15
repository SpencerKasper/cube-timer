class StackmatWorkletProcessor extends AudioWorkletProcessor {
    // This buffer size is small enough to still send a packet every ~230ms,
    // while not cutting off data and producing invalid packets.
    bufferSize = 10240
    chunkBuffer
    offset

    constructor() {
        super()
        this.chunkBuffer = new Float32Array(this.bufferSize)
        this.offset = 0
    }

    process(inputs) {
        const input = inputs[0]
        const inputChannel = input[0]

        this.chunkBuffer.set(inputChannel, this.offset)
        this.offset += inputChannel.length

        if (this.offset >= this.bufferSize) {
            // Buffer is full, post it back to the main thread and reset the buffer
            this.port.postMessage(this.chunkBuffer)
            this.chunkBuffer = new Float32Array(this.bufferSize)
            this.offset = 0
        }

        return true
    }
}

registerProcessor('stackmat-processor', StackmatWorkletProcessor);