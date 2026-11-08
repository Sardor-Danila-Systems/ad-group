// Upscales every PNG in a folder with Apple's on-device super-resolution (VideoToolbox, macOS 26+).
// The low-latency scaler needs no model download but takes at most 960×960, so upscale.mjs feeds it tiles.
// usage: swiftc -O scripts/hero-frames/upscale.swift -o /tmp/upscale && /tmp/upscale <in-dir> <out-dir> [scale=2]
import VideoToolbox
import CoreImage
import AppKit
setvbuf(stdout, nil, _IONBF, 0)
let a = CommandLine.arguments
let inDir = a[1], outDir = a[2]; let scale = a.count > 3 ? Float(a[3]) ?? 2 : 2
let files = try! FileManager.default.contentsOfDirectory(atPath: inDir).filter { $0.hasSuffix(".png") }.sorted()
let first = NSImage(contentsOfFile: "\(inDir)/\(files[0])")!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let W = first.width, H = first.height
let cfg = VTLowLatencySuperResolutionScalerConfiguration(frameWidth: W, frameHeight: H, scaleFactor: scale)
let fmts = cfg.__frameSupportedPixelFormats.map { $0.uint32Value }; let fmt = fmts.contains(kCVPixelFormatType_32BGRA) ? kCVPixelFormatType_32BGRA : fmts[0]
let ci = CIContext(options: [.workingColorSpace: NSNull()])
func makeBuffer(_ w: Int, _ h: Int, _ attrs: [String: Any]) -> CVPixelBuffer {
  var at = attrs; at[kCVPixelBufferPixelFormatTypeKey as String] = fmt; at[kCVPixelBufferWidthKey as String] = w; at[kCVPixelBufferHeightKey as String] = h
  at[kCVPixelBufferIOSurfacePropertiesKey as String] = [:]
  var pb: CVPixelBuffer?; CVPixelBufferCreate(nil, w, h, fmt, at as CFDictionary, &pb); return pb!
}
let proc = VTFrameProcessor()
try! proc.startSession(configuration: cfg)
let sem = DispatchSemaphore(value: 0)
Task {
  for (i, f) in files.enumerated() {
    let img = CIImage(contentsOf: URL(fileURLWithPath: "\(inDir)/\(f)"))!
    let src = makeBuffer(W, H, cfg.sourcePixelBufferAttributes)
    ci.render(img, to: src)
    let dw = Int((Float(W) * scale).rounded()), dh = Int((Float(H) * scale).rounded())
    let dst = makeBuffer(dw, dh, cfg.destinationPixelBufferAttributes)
    let t = CMTime(value: CMTimeValue(i), timescale: 24)
    let p = VTLowLatencySuperResolutionScalerParameters(sourceFrame: VTFrameProcessorFrame(buffer: src, presentationTimeStamp: t)!, destinationFrame: VTFrameProcessorFrame(buffer: dst, presentationTimeStamp: t)!)
    do { try await proc.process(parameters: p) } catch { print("ERR", error); exit(1) }
    let out = CIImage(cvPixelBuffer: dst)
    let url = URL(fileURLWithPath: "\(outDir)/\(f)")
    try! ci.writePNGRepresentation(of: out, to: url, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
    if i % 20 == 0 { print(i, dw, dh) }
  }
  proc.endSession(); sem.signal()
}
sem.wait()
