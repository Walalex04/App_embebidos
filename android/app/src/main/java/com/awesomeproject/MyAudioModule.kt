    package com.tuapp

    import android.media.AudioFormat
    import android.media.AudioRecord
    import android.media.AudioTrack
    import android.media.AudioManager
    import android.media.MediaRecorder
    import android.util.Log
    import com.facebook.react.bridge.*
    import java.io.File
    import java.io.FileInputStream
    import java.io.FileOutputStream
    import java.util.UUID


    class MyAudioModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

        private var audioRecord: AudioRecord? = null
        private var isRecording = false
        private var outputPath: String? = null
        private var recordingThread: Thread? = null

        override fun getName() = "MyAudioModule"

        @ReactMethod
        fun startRecording(promise: Promise) {
            try {
                val sampleRate = 22050
                val channelConfig = AudioFormat.CHANNEL_IN_MONO
                val audioFormat = AudioFormat.ENCODING_PCM_8BIT

                val bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)

                audioRecord = AudioRecord(
                    MediaRecorder.AudioSource.MIC,
                    sampleRate,
                    channelConfig,
                    audioFormat,
                    bufferSize
                )

                val external = reactApplicationContext.getExternalFilesDir(null)

                val randomFileName = "audio_${UUID.randomUUID()}.raw"
                outputPath = external?.absolutePath + "/" + randomFileName
                val outputFile = File(outputPath!!)
                val outputStream = FileOutputStream(outputFile)

                audioRecord?.startRecording()
                isRecording = true

                recordingThread = Thread {
                    val buffer = ByteArray(bufferSize)
                    while (isRecording) {
                        val read = audioRecord!!.read(buffer, 0, buffer.size)
                        if (read > 0) {
                            outputStream.write(buffer, 0, read)
                        }
                    }
                    outputStream.close()
                }

                recordingThread!!.start()

                Log.d("MyAudioModule", "Grabación iniciada en $outputPath")
                promise.resolve(outputPath)
            } catch (e: Exception) {
                Log.e("MyAudioModule", "Error al iniciar grabación", e)
                promise.reject("ERROR_START", e.message)
            }
        }

        @ReactMethod
        fun stopRecording(promise: Promise) {
            try {
                isRecording = false
                audioRecord?.stop()
                audioRecord?.release()
                audioRecord = null
                recordingThread = null

                Log.d("MyAudioModule", "Grabación detenida")
                promise.resolve(outputPath)
            } catch (e: Exception) {
                Log.e("MyAudioModule", "Error al detener grabación", e)
                promise.reject("ERROR_STOP", e.message)
            }
        }

        @ReactMethod
        fun playRecording(path: String, promise: Promise) {
            try {
                val file = File(path)
                if (!file.exists()) {
                    promise.reject("ERROR_PLAY", "Archivo no encontrado")
                    return
                }

                val sampleRate = 22050
                val channelOut = AudioFormat.CHANNEL_OUT_MONO
                val audioFormat = AudioFormat.ENCODING_PCM_8BIT

                val minBufferSize = AudioTrack.getMinBufferSize(sampleRate, channelOut, audioFormat)
                val audioTrack = AudioTrack(
                    AudioManager.STREAM_MUSIC,
                    sampleRate,
                    channelOut,
                    audioFormat,
                    minBufferSize,
                    AudioTrack.MODE_STREAM
                )

                val buffer = ByteArray(minBufferSize)
                val inputStream = FileInputStream(file)

                audioTrack.play()

                var read: Int
                while (inputStream.read(buffer).also { read = it } > 0) {
                    audioTrack.write(buffer, 0, read)
                }

                inputStream.close()
                audioTrack.stop()
                audioTrack.release()

                Log.d("MyAudioModule", "Reproducción terminada")
                promise.resolve(null)
            } catch (e: Exception) {
                Log.e("MyAudioModule", "Error al reproducir", e)
                promise.reject("ERROR_PLAY", e.message)
            }
        }
    }
