"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import styles from "./qr-scanner.module.css";

const MAX_SCAN_WIDTH = 720;

function validateUrl(str: string): { isValid: boolean; url: string | null; protocol: string | null } {
  try {
    const parsed = new URL(str);
    if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:" || parsed.protocol === "tel:") {
      return { isValid: true, url: parsed.href, protocol: parsed.protocol };
    }
    return { isValid: false, url: null, protocol: null };
  } catch {
    return { isValid: false, url: null, protocol: null };
  }
}

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualInputValue, setManualInputValue] = useState("");
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopScanner = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const scanLoopRef = useRef<() => void>(() => {});

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (context && video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0) {
      // Downscale large frames: much faster decoding with no loss for on-screen codes
      const scale = Math.min(1, MAX_SCAN_WIDTH / video.videoWidth);
      const width = Math.round(video.videoWidth * scale);
      const height = Math.round(video.videoHeight * scale);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, width, height, {
        inversionAttempts: "attemptBoth",
      });

      if (code && code.data.trim()) {
        setScannedResult(code.data.trim());
        setErrorMessage(null);
        stopScanner();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
  }, [stopScanner]);

  useEffect(() => {
    scanLoopRef.current = scanFrame;
  }, [scanFrame]);

  const startScanner = async () => {
    setErrorMessage(null);
    setScannedResult(null);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage(
        "Camera access needs a secure (HTTPS or localhost) connection and a supported browser. Upload a QR image or paste the code below instead."
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (firstError) {
        const name = (firstError as Error).name;
        if (name === "NotAllowedError" || name === "SecurityError") throw firstError;
        // Desktop / unusual cameras may reject the constraints: retry with defaults
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      await video.play();
      setIsScanning(true);
      animationFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
    } catch (err: unknown) {
      stopScanner();
      const error = err as Error;
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setErrorMessage(
          "Camera permission was denied. Allow camera access in your browser, or upload a QR image / paste the code below."
        );
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setErrorMessage("No camera was detected on this device. Upload a QR image or paste the code below.");
      } else if (error.name === "NotReadableError") {
        setErrorMessage("The camera is currently in use by another application. Close it and try again.");
      } else {
        setErrorMessage(
          `Unable to access camera: ${error.message || "Unknown error"}. Upload a QR image or paste the code below.`
        );
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setErrorMessage(null);
    stopScanner();

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code && code.data.trim()) {
        setScannedResult(code.data.trim());
      } else {
        setScannedResult(null);
        setErrorMessage("No QR code could be found in that image. Try a sharper, well-lit picture.");
      }
    } catch {
      setErrorMessage("That file could not be read as an image. Please choose a PNG or JPG.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInputValue.trim()) return;
    setScannedResult(manualInputValue.trim());
    setErrorMessage(null);
  };

  const handleCopyResult = async () => {
    if (!scannedResult) return;
    try {
      await navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  const urlValidation = scannedResult ? validateUrl(scannedResult) : null;

  return (
    <div className={styles.scannerPanel} id="qr-code-scanner">
      <div className={styles.scannerHeader}>
        <span className={styles.scannerBadge}>Interactive Tool</span>
        <h2 className={styles.scannerTitle}>QR Code Scanner</h2>
        <p className={styles.scannerDesc}>
          Scan a QR code with your camera or upload an image. All decoding happens directly in your
          browser — nothing is sent to any server.
        </p>
      </div>

      <div
        className={`${styles.scannerViewport} ${isScanning ? styles.videoActive : ""}`}
        aria-live="polite"
      >
        <video
          ref={videoRef}
          className={`${styles.videoElement} ${isScanning ? styles.videoShown : ""}`}
          playsInline
          muted
          aria-label="Live camera feed for QR code scanning"
        />
        <canvas ref={canvasRef} className={styles.hiddenCanvas} />

        {isScanning && (
          <div className={styles.scanOverlay} aria-hidden="true">
            <span className={styles.scanFrame} />
            <span className={styles.scanLine} />
            <span className={styles.scanHint}>Point the camera at a QR code</span>
          </div>
        )}

        {!isScanning && (
          <div className={styles.viewportPlaceholder}>
            <svg className={styles.placeholderIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className={styles.placeholderText}>
              Tap &quot;Start Scanner&quot; to open your camera, or upload a QR image.
            </span>
          </div>
        )}
      </div>

      <div className={styles.controlsRow}>
        {!isScanning ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={startScanner}
            aria-label="Start QR code camera scanner"
          >
            Start Scanner
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={stopScanner}
            aria-label="Stop QR code camera scanner"
          >
            Stop Scanner
          </button>
        )}

        <label className={`btn btn-secondary ${styles.uploadBtn}`}>
          Upload QR Image
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {errorMessage && (
        <div className={styles.errorBanner} role="alert">
          <strong>Notice:</strong> {errorMessage}
        </div>
      )}

      {scannedResult && (
        <div className={styles.resultBox} role="region" aria-label="Scanned QR code content">
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>Decoded QR Result</span>
            {urlValidation?.isValid ? (
              <span className={styles.urlBadge}>Valid Link ({urlValidation.protocol})</span>
            ) : (
              <span className={styles.textBadge}>Text Content</span>
            )}
          </div>

          <div className={styles.resultContent}>{scannedResult}</div>

          <div className={styles.resultActions}>
            <button type="button" className="btn btn-secondary" onClick={handleCopyResult}>
              {copied ? "Copied!" : "Copy Result"}
            </button>

            {urlValidation?.isValid && (
              <a
                href={urlValidation.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                aria-label={`Open validated link in new window: ${scannedResult}`}
              >
                Open Link &rarr;
              </a>
            )}

            <button type="button" className="btn btn-secondary" onClick={() => setScannedResult(null)}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className={styles.manualSection}>
        <h3 className={styles.manualTitle}>Paste a Code Manually</h3>
        <p className={styles.manualDesc}>
          No camera? Paste or type the code text here to inspect and validate it.
        </p>

        <form onSubmit={handleManualSubmit} className={styles.manualInputRow}>
          <input
            type="text"
            className={styles.manualInput}
            placeholder="Paste code or URL (e.g. https://www.recenturesoft.com)"
            value={manualInputValue}
            onChange={(e) => setManualInputValue(e.target.value)}
            aria-label="Manual QR code or URL input"
          />
          <button type="submit" className={`btn btn-secondary ${styles.manualBtn}`}>
            Inspect Code
          </button>
        </form>
      </div>
    </div>
  );
}
