// Extracts every frame of a video as PNG (macOS, AVFoundation; no ffmpeg needed).
// usage: swiftc -O scripts/hero-frames/extract.swift -o /tmp/extract && /tmp/extract <video.mp4> <out-dir>
import AVFoundation
import AppKit

let args = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let outDir = args[2]

Task {
  do {
    let duration = CMTimeGetSeconds(try await asset.load(.duration))
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw NSError(domain: "no video", code: 1) }
    let fps = Double(try await track.load(.nominalFrameRate))
    let count = Int((duration * fps).rounded(.down))
    let gen = AVAssetImageGenerator(asset: asset)
    gen.appliesPreferredTrackTransform = true
    gen.requestedTimeToleranceBefore = .zero
    gen.requestedTimeToleranceAfter = .zero
    for i in 0..<count {
      let t = CMTime(value: CMTimeValue(i), timescale: CMTimeScale(fps.rounded()))
      let (img, _) = try await gen.image(at: t)
      let rep = NSBitmapImageRep(cgImage: img)
      try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(outDir)/\(String(format: "%04d", i)).png"))
    }
    print("frames:", count, "fps:", fps, "size:", gen.maximumSize)
    exit(0)
  } catch {
    print("ERR", error)
    exit(1)
  }
}
RunLoop.main.run()
