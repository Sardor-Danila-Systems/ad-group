// Makes in-between frames with Apple's optical-flow frame interpolation (VideoToolbox, macOS 26+).
// usage: swiftc -O scripts/hero-frames/interpolate.swift -o /tmp/interpolate && /tmp/interpolate <jobs.txt>
// jobs.txt: one line per frame to make: <a.png> <b.png> <phase 0..1> <out.png> (paths without spaces)
import VideoToolbox
import CoreImage
import AppKit
setvbuf(stdout, nil, _IONBF, 0)
print("supported:", VTFrameRateConversionConfiguration.isSupported)
let jobs = try! String(contentsOfFile: CommandLine.arguments[1], encoding: .utf8).split(separator: "\n").map { $0.split(separator: " ").map(String.init) }.filter { $0.count == 4 }
let first = CIImage(contentsOf: URL(fileURLWithPath: jobs[0][0]))!
let W = Int(first.extent.width), H = Int(first.extent.height)
guard let cfg = VTFrameRateConversionConfiguration(frameWidth: W, frameHeight: H, usePrecomputedFlow: false, qualityPrioritization: .quality, revision: VTFrameRateConversionConfiguration.defaultRevision) else { print("config nil"); exit(1) }
let fmts = cfg.__frameSupportedPixelFormats.map { $0.uint32Value }
let fmt = fmts.contains(kCVPixelFormatType_32BGRA) ? kCVPixelFormatType_32BGRA : fmts[0]
print("format", String(format: "%c%c%c%c", (fmt>>24)&255, (fmt>>16)&255, (fmt>>8)&255, fmt&255))
let ci = CIContext(options: [.workingColorSpace: NSNull()])
func buffer(_ attrs: [String: Any]) -> CVPixelBuffer {
  var at = attrs; at[kCVPixelBufferPixelFormatTypeKey as String] = fmt; at[kCVPixelBufferWidthKey as String] = W; at[kCVPixelBufferHeightKey as String] = H
  at[kCVPixelBufferIOSurfacePropertiesKey as String] = [:]
  var pb: CVPixelBuffer?; CVPixelBufferCreate(nil, W, H, fmt, at as CFDictionary, &pb); return pb!
}
func load(_ p: String) -> CVPixelBuffer { let b = buffer(cfg.sourcePixelBufferAttributes); ci.render(CIImage(contentsOf: URL(fileURLWithPath: p))!, to: b); return b }
let proc = VTFrameProcessor()
do { try proc.startSession(configuration: cfg) } catch { print("session error", error); exit(1) }
let sem = DispatchSemaphore(value: 0)
Task {
  for (n, j) in jobs.enumerated() {
    let a = VTFrameProcessorFrame(buffer: load(j[0]), presentationTimeStamp: CMTime(value: 0, timescale: 24))!
    let b = VTFrameProcessorFrame(buffer: load(j[1]), presentationTimeStamp: CMTime(value: 1, timescale: 24))!
    let dstBuf = buffer(cfg.destinationPixelBufferAttributes)
    let dst = VTFrameProcessorFrame(buffer: dstBuf, presentationTimeStamp: CMTime(value: 1, timescale: 48))!
    guard let p = VTFrameRateConversionParameters(sourceFrame: a, nextFrame: b, opticalFlow: nil, interpolationPhase: [Float(j[2])!], submissionMode: .random, destinationFrames: [dst]) else { print("params nil"); exit(1) }
    do { try await proc.process(parameters: p) } catch { print("ERR", error); exit(1) }
    try! ci.writePNGRepresentation(of: CIImage(cvPixelBuffer: dstBuf), to: URL(fileURLWithPath: j[3]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
    if n % 10 == 0 { print(n, j[3]) }
  }
  proc.endSession(); sem.signal()
}
sem.wait()
