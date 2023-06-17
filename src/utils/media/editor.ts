import FFMPEG from "./ffmpeg";

class Editor extends FFMPEG {
  constructor() {
    super();
  }

  // public async extractAudio(inputPath: string, outputPath: string): Promise<void> {
  //   const command = this.create(inputPath, outputPath)
  //     .noVideo()
  //     .outputOptions('-vn')
  //     .outputFormat('mp3');

  //   await this.execute(command);
  // }

  // public async resizeVideo(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
  //   const command = this.create(inputPath, outputPath)
  //     .size(`${width}x${height}`)
  //     .outputOptions('-c:v', 'libx264')
  //     .outputOptions('-c:a', 'copy');

  //   await this.execute(command);
  // }

  // public async extractAudioV2(audioInputPath: string, audioOutputPath: string): Promise<void> {
  //   const command = this.create(inputPath, outputPath)
  //     .size(`${width}x${height}`)
  //     .outputOptions('-c:v', 'libx264')
  //     .outputOptions('-c:a', 'copy');

  //   await this.execute(command);
  // }



  public async trimVideo(inputPath: string, outputPath: string, startTime: number, duration: number): Promise<any> {
    const command = this.create(inputPath, outputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .outputOptions('-acodec', 'copy');

    return this.execute(command, outputPath);
  }
}

export default Editor;