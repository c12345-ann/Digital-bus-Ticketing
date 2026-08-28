"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  XCircle,
  QrCode,
  Search,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  User,
  Bus,
  Clock,
  Printer,
  ShieldCheck,
  Zap,
  RefreshCw,
  Flashlight,
  SwitchCamera,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { DigitalTicket } from "@/types";

const TICKET_REFERENCE_PATTERN = /\bBT-\d{4}-[A-Z0-9]+\b/i;

function extractTicketReference(value: string) {
  return value.trim().toUpperCase().match(TICKET_REFERENCE_PATTERN)?.[0] ?? null;
}

// Acoustic audio synthesizer using native Web Audio API
function playScanSound(type: "valid" | "duplicate" | "invalid") {
  try {
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "valid") {
      // Pleasant high-pitch two-tone chime (880Hz -> 1320Hz)
      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } else if (type === "duplicate") {
      // Warning double beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(350, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Low error buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // Audio context not allowed or blocked
  }
}

function triggerHaptic(type: "valid" | "duplicate" | "invalid") {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      if (type === "valid") {
        navigator.vibrate([100, 50, 100]);
      } else if (type === "duplicate") {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate([400]);
      }
    } catch {
      // Ignore vibration error
    }
  }
}

export default function ConductorScanPage() {
  const store = useAppStore();
  const toast = useToast();

  const [isScanning, setIsScanning] = useState(true);
  const [referenceInput, setReferenceInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasCameraSupport, setHasCameraSupport] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");

  const [validationResult, setValidationResult] = useState<{
    status: "valid" | "used" | "cancelled" | "invalid";
    message: string;
    ticket?: DigitalTicket;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize and request camera
  const startCamera = async (facing: "environment" | "user" = cameraFacing) => {
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraSupport(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }
      setCameraActive(true);
      setHasCameraSupport(true);
    } catch {
      setCameraActive(false);
      // Graceful fallback to HUD sensor mode
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    if (cameraActive) {
      startCamera(nextFacing);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Continuous live video frame decoding loop with jsQR & BarcodeDetector
  useEffect(() => {
    if (!cameraActive || !isScanning || validationResult) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let isScanningFrame = false;

    const scanVideoFrame = () => {
      if (!videoRef.current || !canvasRef.current || isScanningFrame) {
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
        return;
      }

      const video = videoRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        isScanningFrame = true;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data && code.data.trim()) {
            const raw = code.data.trim();
            // Avoid repetitive re-scanning of the exact same code in the same second
            if (raw !== lastScannedCode) {
              setLastScannedCode(raw);
              setReferenceInput(raw);
              handleValidate(raw);
              isScanningFrame = false;
              return;
            }
          }
        }
        isScanningFrame = false;
      }

      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [cameraActive, isScanning, validationResult, lastScannedCode]);

  // Process ticket reference through store validation engine
  async function handleValidate(rawReference: string) {
    if (!rawReference.trim()) {
      toast.error("Empty Reference", "Please enter or scan a ticket reference number.");
      return;
    }

    setIsProcessing(true);

    // Extract ticket reference (e.g. BT-2026-0148 or similar)
    const cleanRef = extractTicketReference(rawReference) ?? rawReference.trim().toUpperCase();

    try {
      const res = await store.validateTicket(cleanRef);

      if (res.success && res.ticket) {
        setValidationResult({
          status: "valid",
          message: res.message,
          ticket: res.ticket,
        });

        if (soundEnabled) playScanSound("valid");
        triggerHaptic("valid");
        toast.success("Ticket Verified & Valid", `${res.ticket.passengerName} (Seat ${res.ticket.seatNumber}) boarded.`);
      } else if (res.reason === "already_used") {
        setValidationResult({
          status: "used",
          message: res.message,
          ticket: res.ticket,
        });

        if (soundEnabled) playScanSound("duplicate");
        triggerHaptic("duplicate");
        toast.warning("Duplicate Scan Alert", res.message);
      } else if (res.reason === "cancelled") {
        setValidationResult({
          status: "cancelled",
          message: res.message,
          ticket: res.ticket,
        });

        if (soundEnabled) playScanSound("invalid");
        triggerHaptic("invalid");
        toast.error("Cancelled Ticket", res.message);
      } else {
        setValidationResult({
          status: "invalid",
          message: res.message,
        });

        if (soundEnabled) playScanSound("invalid");
        triggerHaptic("invalid");
        toast.error("Invalid Pass", res.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to validate the ticket.";
      setValidationResult({ status: "invalid", message });
      toast.error("Validation Failed", message);
    } finally {
      setIsProcessing(false);
    }
  }

  // Real client-side QR image snapshot decoder using Canvas + jsQR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info("Analyzing QR Photo", `Decoding digital pass from ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Decoder Error", "Could not create canvas context.");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          const decoded = code.data.trim();
          toast.success("QR Code Decoded", `Extracted pass: ${decoded}`);
          setReferenceInput(decoded);
          handleValidate(decoded);
        } else {
          // Check if filename contains a reference pattern or notify user clearly
          const matchInName = extractTicketReference(file.name);
          if (matchInName) {
            const ref = matchInName;
            setReferenceInput(ref);
            handleValidate(ref);
          } else {
            toast.error(
              "QR Code Not Detected",
              "Could not locate a valid QR code in this image. Please crop closer or enter reference manually."
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input so user can upload the same file again if desired
    e.target.value = "";
  };

  const handleQuickSampleScan = (ref: string) => {
    setReferenceInput(ref);
    handleValidate(ref);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate(referenceInput);
  };

  const handleResetScanner = () => {
    setValidationResult(null);
    setReferenceInput("");
    setLastScannedCode("");
    setIsScanning(true);
  };

  const handlePrintSlip = () => {
    toast.success("Boarding Slip Printed", "Passenger thermal receipt printed on mobile bus printer.");
  };

  return (
    <div className="space-y-6">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Conductor Optical Scanner
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time live optical QR verification & passenger manifest check-in for <strong className="text-slate-900">BUS-18</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              soundEnabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-100 text-slate-500"
            }`}
            title="Toggle validation audio chime"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{soundEnabled ? "Audio Chime On" : "Muted"}</span>
          </button>

          {/* Camera Stream Toggle */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              cameraActive
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
            }`}
          >
            {cameraActive ? <Camera className="h-3.5 w-3.5" /> : <CameraOff className="h-3.5 w-3.5" />}
            <span>{cameraActive ? "Camera Live" : "Camera Idle"}</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Viewfinder HUD & Controls */}
        <div className="space-y-6">
          {/* Scanner Viewfinder Box */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-slate-950 p-4 sm:p-6 text-white shadow-2xl">
            {/* Viewfinder Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white tracking-wide">
                  {cameraActive ? "Optical Video Stream (60 FPS)" : "High-Speed Optical Sensor"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {cameraActive && (
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    title="Switch front/back camera lens"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                )}
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                  SENSOR READY
                </span>
              </div>
            </div>

            {/* Viewfinder Target Area */}
            <div className="relative my-4 sm:my-6 flex h-60 sm:h-72 items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/50 bg-slate-900/80 overflow-hidden">
              {/* Real Video Feed if active */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              {/* Corner Targeting Brackets */}
              <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 border-t-4 border-l-4 border-blue-400 rounded-tl-xl shadow-[0_0_10px_#60a5fa]" />
              <div className="pointer-events-none absolute top-4 right-4 h-8 w-8 border-t-4 border-r-4 border-blue-400 rounded-tr-xl shadow-[0_0_10px_#60a5fa]" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-blue-400 rounded-bl-xl shadow-[0_0_10px_#60a5fa]" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-blue-400 rounded-br-xl shadow-[0_0_10px_#60a5fa]" />

              {/* Animated Laser Scanning Beam */}
              {isScanning && !validationResult && (
                <div className="animate-laser pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]" />
              )}

              {/* Status Visual Overlays */}
              {validationResult ? (
                <div
                  className={`relative z-10 mx-4 flex flex-col items-center rounded-2xl p-5 text-center shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200 ${
                    validationResult.status === "valid"
                      ? "bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100"
                      : validationResult.status === "used"
                      ? "bg-amber-950/90 border-2 border-amber-400 text-amber-100"
                      : "bg-rose-950/90 border-2 border-rose-400 text-rose-100"
                  }`}
                >
                  {validationResult.status === "valid" ? (
                    <CheckCircle2 className="h-14 w-14 text-emerald-400 animate-bounce" />
                  ) : validationResult.status === "used" ? (
                    <AlertCircle className="h-14 w-14 text-amber-400 animate-pulse" />
                  ) : (
                    <XCircle className="h-14 w-14 text-rose-400 animate-shake" />
                  )}
                  <h3 className="mt-2 text-lg font-extrabold text-white">
                    {validationResult.status === "valid"
                      ? "PASS VERIFIED • BOARDED"
                      : validationResult.status === "used"
                      ? "ALREADY BOARDED"
                      : "INVALID PASS"}
                  </h3>
                  <p className="mt-1 text-xs opacity-90 max-w-xs">{validationResult.message}</p>
                </div>
              ) : (
                <div className="pointer-events-none relative z-10 text-center space-y-2 p-4 bg-slate-950/40 rounded-xl backdrop-blur-xs">
                  <QrCode className="mx-auto h-16 w-16 text-slate-300 animate-pulse" />
                  <p className="text-xs font-bold text-white shadow-xs">
                    Align passenger QR boarding pass inside target box
                  </p>
                </div>
              )}
            </div>

            {/* Viewfinder Controls Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 font-bold text-slate-200 hover:border-blue-500 hover:bg-blue-950 hover:text-white transition shadow-sm"
              >
                <Upload className="h-3.5 w-3.5 text-blue-400" />
                Upload QR Photo / Screenshot
              </button>

              {validationResult && (
                <button
                  type="button"
                  onClick={handleResetScanner}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-blue-500/30 hover:bg-blue-500 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Next Passenger
                </button>
              )}
            </div>
          </div>

          {/* Manual Reference & Instant Lookup Form */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              Manual Reference Lookup
            </h2>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                  placeholder="e.g. BT-2026-0148"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <Button
                type="submit"
                loading={isProcessing}
                className="bg-blue-600 hover:bg-blue-500 px-4 text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Verify Pass
              </Button>
            </form>

            {/* Quick Test Triggers */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Simulation Scenarios
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSampleScan("BT-2026-0148")}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  ✓ Test Pass (BT-2026-0148)
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSampleScan("BT-INVALID-999")}
                  className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition"
                >
                  ✕ Invalid (BT-INVALID-999)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Verified Passenger Card & Shift Audit Stream */}
        <div className="space-y-6">
          {/* Passenger Verification Card */}
          {validationResult?.ticket ? (
            <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Passenger Record
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {validationResult.ticket.passengerName}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    validationResult.status === "valid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {validationResult.status === "valid" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {validationResult.ticket.status.toUpperCase()}
                </span>
              </div>

              {/* Seat & Route Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-blue-50/80 p-4 border border-blue-100 text-center">
                  <span className="text-slate-500 font-medium block">Assigned Seat</span>
                  <p className="text-3xl font-extrabold text-blue-700 font-mono mt-1">
                    {validationResult.ticket.seatNumber}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Coach {validationResult.ticket.busNumber || "BUS-18"}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1.5">
                  <span className="text-slate-400 block font-medium">Scheduled Route</span>
                  <p className="font-bold text-slate-900 leading-tight">
                    {validationResult.ticket.route}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1 font-mono">
                    Dep: {validationResult.ticket.departureTime}
                  </p>
                </div>
              </div>

              {/* Fare & Transaction Details */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Fare Paid:</span>
                  <span className="font-extrabold text-slate-900">
                    NLe {validationResult.ticket.fare}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Payment Gateway:</span>
                  <span className="text-emerald-700">{validationResult.ticket.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Pass Reference:</span>
                  <span className="font-mono text-blue-700">
                    {validationResult.ticket.reference}
                  </span>
                </div>
              </div>

              {/* Conductor Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <Printer className="h-4 w-4 text-slate-600" />
                  Print Slip
                </button>

                <Button
                  onClick={handleResetScanner}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Checked In
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm text-center py-12 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <QrCode className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Awaiting Ticket Scan</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Scan or upload a digital boarding pass image to verify passenger details and seat reservations in real-time.
              </p>
            </div>
          )}

          {/* Live Validation Audit Stream */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Shift Validation Audit Logs</h3>
              <span className="font-mono text-[11px] text-blue-600 font-bold">
                {store.validationLogs.length} Scans Today
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {store.validationLogs.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100 hover:bg-slate-100/80 transition"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{log.passengerName}</p>
                    <p className="font-mono text-[10px] text-slate-400">{log.ticketReference} • {log.timestamp}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === "Valid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {log.status === "Valid" ? "✓ Boarded" : "✕ Error"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
