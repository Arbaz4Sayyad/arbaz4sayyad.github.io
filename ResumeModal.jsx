import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Interactive In-Page Resume Modal Component
 * 
 * Features:
 * - Glassmorphic backdrop & modal card styling
 * - Embedded interactive iframe pointing to resume URL
 * - Animated loading spinner state
 * - Direct download / print action
 * - Open in new tab action
 * - Keyboard (Esc) dismissal
 * - Backdrop click dismissal
 * - Accessible ARIA attributes & body scroll locking
 */
export default function ResumeModal({
  isOpen = false,
  onClose,
  resumeUrl = "https://arbaz4sayyad.github.io/resume/",
  pdfDownloadUrl = "https://arbaz4sayyad.github.io/resume/Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf",
  title = "Arbaz Sayyad — Resume",
  subtitle = "Backend Software Engineer | Distributed Systems"
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const iframeRef = useRef(null);
  const modalContentRef = useRef(null);

  // Handle Escape key dismissal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose?.();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Handle direct file download
  const handleDownloadOrPrint = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(pdfDownloadUrl);
      if (!response.ok) throw new Error("Download request failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to download link:", err);
      const link = document.createElement('a');
      link.href = pdfDownloadUrl;
      link.download = 'Arbaz_Sayyad_Software_Engineer_Backend_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-6xl h-[90vh] max-h-[92vh] bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/60 shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/90 shrink-0 select-none">
          {/* Left Title & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 id="resume-modal-title" className="text-white font-bold text-sm sm:text-base md:text-lg tracking-tight truncate flex items-center gap-2">
                <span>{title}</span>
              </h3>
              <p className="text-slate-400 text-xs truncate font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Open in New Tab Button */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/70 hover:border-slate-600 transition-all shadow-sm"
              title="Open Resume in new browser tab"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Open in New Tab</span>
              <span className="sm:hidden">Open</span>
            </a>

            {/* Download / Print Button */}
            <button
              type="button"
              onClick={handleDownloadOrPrint}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-75 text-white text-xs font-semibold shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
              title="Download Resume PDF"
            >
              {isDownloading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download / Print</span>
                </>
              )}
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/90 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / Embedded Iframe Area */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 transition-opacity">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-slate-400 font-medium">Loading interactive resume...</p>
            </div>
          )}

          {/* Iframe View */}
          <iframe
            ref={iframeRef}
            src={resumeUrl}
            title={title}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 bg-white"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
