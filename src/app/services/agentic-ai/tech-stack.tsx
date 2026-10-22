"use client";

import React, { useState } from "react";
import styles from "./tech-stack.module.css";

// =====================================================================
// Tool Brand SVGs
// =====================================================================

function LangGraphIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="18" r="3.5" fill="#10b981" />
      <circle cx="18" cy="6" r="3.5" fill="#34d399" />
      <circle cx="8" cy="7" r="2.5" fill="#059669" />
      <path d="M8.5 16L15.5 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 9.5L6 14.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

function CrewAIIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#e11d48" />
      <circle cx="12" cy="12" r="5.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="26 8" />
      <circle cx="12" cy="12" r="2" fill="#ffffff" />
    </svg>
  );
}

function AutoGenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L4 8V16L12 21L20 16V8L12 3Z"
        fill="#8b5cf6"
        fillOpacity="0.25"
        stroke="#a855f7"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.5" fill="#c084fc" />
      <path d="M12 3V8.5M4 16L9 13.5M20 16L15 13.5" stroke="#e9d5ff" strokeWidth="1.6" />
    </svg>
  );
}

function LlamaIndexIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 4C10 2.9 10.9 2 12 2C13.1 2 14 2.9 14 4V8H16C17.7 8 19 9.3 19 11V15H17V21H14V17H10V21H7V13L5 10L6.5 8.5L8.5 10.5V4H10Z"
        fill="#84cc16"
      />
      <circle cx="12" cy="5" r="1" fill="#065f46" />
    </svg>
  );
}

function SemanticKernelIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8.5" height="8.5" rx="1.5" fill="#f25022" />
      <rect x="12.5" y="3" width="8.5" height="8.5" rx="1.5" fill="#7fba00" />
      <rect x="3" y="12.5" width="8.5" height="8.5" rx="1.5" fill="#00a4ef" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1.5" fill="#ffb900" />
    </svg>
  );
}

function OpenAIIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.5 10.2a5.3 5.3 0 0 0-.4-4.2 5.4 5.4 0 0 0-4.6-2.6c-.4 0-.8 0-1.2.2A5.3 5.3 0 0 0 11 2.2a5.4 5.4 0 0 0-5.1 3.7A5.3 5.3 0 0 0 2.5 8a5.4 5.4 0 0 0 .5 5.3 5.3 5.3 0 0 0 .4 4.2 5.4 5.4 0 0 0 4.6 2.6c.4 0 .8 0 1.2-.2a5.3 5.3 0 0 0 4.3 1.4 5.4 5.4 0 0 0 5.1-3.7 5.3 5.3 0 0 0 3.4-2.1 5.4 5.4 0 0 0-.5-5.3ZM12 13.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.8 8.2L20 7L15.6 11.5L19.5 16.5L13.5 14.8L12 21L10.5 14.8L4.5 16.5L8.4 11.5L4 7L10.2 8.2L12 2Z"
        fill="#d97757"
      />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="url(#geminiGrad)"
      />
      <defs>
        <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.35" stopColor="#818cf8" />
          <stop offset="0.7" stopColor="#c084fc" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MetaLlamaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 8C4.5 8 2.5 10 2.5 12.5C2.5 15 4.5 17 7 17C9.5 17 11 15 12 13.5C13 15 14.5 17 17 17C19.5 17 21.5 15 21.5 12.5C21.5 10 19.5 8 17 8C14.5 8 13 10 12 11.5C11 10 9.5 8 7 8Z"
        stroke="#0081fb"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MistralIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="3.5" height="16" fill="#f25c27" />
      <rect x="17.5" y="4" width="3.5" height="16" fill="#f25c27" />
      <rect x="6.5" y="7" width="3.5" height="7" fill="#ff7a00" />
      <rect x="14" y="7" width="3.5" height="7" fill="#ff7a00" />
      <rect x="10" y="11" width="4" height="6" fill="#ff9900" />
    </svg>
  );
}

function PostgresIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C7.5 3 4 6.5 4 11C4 14.5 6.5 17.5 9.5 18.5V21H12V18.8C16.5 18.5 20 15 20 11C20 6.5 16.5 3 12 3Z"
        fill="#336791"
      />
      <circle cx="9.5" cy="9.5" r="1.5" fill="#ffffff" />
      <path d="M12 13C10.5 13 9 14.2 9 16.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PineconeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5" r="2" fill="#38bdf8" />
      <circle cx="7" cy="9" r="2" fill="#38bdf8" />
      <circle cx="17" cy="9" r="2" fill="#38bdf8" />
      <circle cx="12" cy="13" r="2.2" fill="#ffffff" />
      <circle cx="7" cy="17" r="2" fill="#38bdf8" />
      <circle cx="17" cy="17" r="2" fill="#38bdf8" />
      <circle cx="12" cy="20" r="1.8" fill="#38bdf8" />
      <path d="M12 5L7 9M12 5L17 9M7 9L12 13M17 9L12 13M12 13L7 17M12 13L17 17M7 17L12 20M17 17L12 20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
    </svg>
  );
}

function QdrantIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#1e293b" stroke="#dc2626" strokeWidth="1.8" />
      <path d="M12 2L20 7L12 12L4 7L12 2Z" fill="#dc2626" />
      <path d="M12 12L20 7V17L12 22V12Z" fill="#ef4444" />
      <circle cx="12" cy="12" r="3" fill="#38bdf8" />
    </svg>
  );
}

function WeaviateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6L6.5 18L10 9L12 14L14 9L17.5 18L21 6"
        stroke="#8b5cf6"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedisIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L21 8L12 13L3 8L12 3Z" fill="#dc2626" />
      <path d="M3 10.5L12 15.5L21 10.5V13.5L12 18.5L3 13.5V10.5Z" fill="#b91c1c" />
      <path d="M3 15.5L12 20.5L21 15.5V17.5L12 22.5L3 17.5V15.5Z" fill="#991b1b" />
    </svg>
  );
}

function AWSBedrockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <text x="3" y="11" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="sans-serif">
        aws
      </text>
      <path
        d="M4 16C9 19.5 16 18.5 20 14"
        stroke="#ff9900"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M18.5 13.5L21 14.5L19.5 17" fill="#ff9900" />
    </svg>
  );
}

function AzureFoundryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 3L4 18H10L14 11L18 18H20.5L13 3Z"
        fill="#0078d4"
      />
      <path
        d="M10 18L14 11L19.5 21H9.5L10 18Z"
        fill="#008ad7"
      />
    </svg>
  );
}

function LangSmithIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 12C6 9 8.5 6.5 11.5 6.5C14.5 6.5 16.5 9 17.5 12C18.5 15 20.5 17.5 23.5 17.5"
        stroke="#06b6d4"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="#38bdf8" />
    </svg>
  );
}

function ArizeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L3 19H8L12 11L16 19H21L12 3Z"
        fill="#ef4444"
      />
      <path d="M12 14L9 19H15L12 14Z" fill="#fca5a5" />
    </svg>
  );
}

function OpenTelemetryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="8" cy="12" r="2" fill="#f59e0b" />
      <circle cx="16" cy="12" r="2" fill="#f97316" />
      <circle cx="12" cy="8" r="1.5" fill="#fbbf24" />
      <circle cx="12" cy="16" r="1.5" fill="#fbbf24" />
    </svg>
  );
}

// =====================================================================
// Integration Partner SVGs (Original 8 + Expanded 8)
// =====================================================================

function SlackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 14.5a2.5 2.5 0 0 1-2.5-2.5c0-1.4 1.1-2.5 2.5-2.5h2.5v2.5c0 1.4-1.1 2.5-2.5 2.5Z" fill="#e01e5a" />
      <path d="M7.5 14.5a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-5 0v-2.5c0-1.4 1.1-2.5 2.5-2.5Z" fill="#e01e5a" />
      <path d="M9.5 6a2.5 2.5 0 0 1 2.5-2.5c1.4 0 2.5 1.1 2.5 2.5v2.5H12c-1.4 0-2.5-1.1-2.5-2.5Z" fill="#36c5f0" />
      <path d="M9.5 7.5a2.5 2.5 0 0 1 2.5 2.5v2.5H9.5a2.5 2.5 0 0 1 0-5Z" fill="#36c5f0" />
      <path d="M18 9.5a2.5 2.5 0 0 1 2.5 2.5c0 1.4-1.1 2.5-2.5 2.5h-2.5V12c0-1.4 1.1-2.5 2.5-2.5Z" fill="#2eb67d" />
      <path d="M16.5 9.5a2.5 2.5 0 0 1-2.5-2.5V4.5a2.5 2.5 0 0 1 5 0V7c0 1.4-1.1 2.5-2.5 2.5Z" fill="#2eb67d" />
      <path d="M14.5 18a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5v-2.5h2.5c1.4 0 2.5 1.1 2.5 2.5Z" fill="#ecb22e" />
      <path d="M14.5 16.5a2.5 2.5 0 0 1-2.5-2.5V11.5h2.5a2.5 2.5 0 0 1 0 5Z" fill="#ecb22e" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#000000" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
      <path d="M7 6.5L14.5 6.5L17.5 17.5H14.5L11.5 10.5V17.5H8.5V6.5H7Z" fill="#ffffff" />
    </svg>
  );
}

function GoogleDriveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8.5 3.5L15.5 3.5L21.5 14L14.5 14L8.5 3.5Z" fill="#ffba00" />
      <path d="M2.5 14L5.5 8.5L12.5 20.5L6.5 20.5L2.5 14Z" fill="#00ac47" />
      <path d="M8.5 14L15.5 14L21.5 20.5L9.5 20.5L8.5 14Z" fill="#0066da" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        fill="#ffffff"
      />
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
      <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
      <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
      <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
      <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
    </svg>
  );
}

function JiraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11.5 2L4 9.5L11.5 17L19 9.5L11.5 2Z" fill="#0052cc" />
      <path d="M16.5 7L11.5 12L16.5 17L21.5 12L16.5 7Z" fill="#2684ff" />
      <path d="M6.5 14.5L11.5 19.5L14 17L9 12L6.5 14.5Z" fill="#0052cc" opacity="0.8" />
    </svg>
  );
}

function HubSpotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="#ff7a59" />
      <circle cx="12" cy="4" r="2.2" fill="#ff7a59" />
      <circle cx="19.5" cy="8.5" r="2.2" fill="#ff7a59" />
      <circle cx="19.5" cy="15.5" r="2.2" fill="#ff7a59" />
      <path d="M12 6.2V8M14.8 10L17.5 8.5M14.8 14L17.5 15.5" stroke="#ff7a59" strokeWidth="2" />
    </svg>
  );
}

function SalesforceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.5 9C17 6.5 14.8 4.5 12 4.5C9.8 4.5 7.8 5.8 7 7.8C6.5 7.5 6 7.3 5.3 7.3C3.5 7.3 2 8.8 2 10.7C2 12 2.7 13.2 3.8 13.7C3.3 14.4 3 15.2 3 16C3 18.2 4.8 20 7 20H17.5C19.4 20 21 18.4 21 16.5C21 14.8 19.8 13.3 18.2 13C18.4 12.3 18.5 11.7 18.5 11C18.5 10.3 18.1 9.6 17.5 9Z"
        fill="#00a1e0"
      />
    </svg>
  );
}

function MSTeamsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M16.5 6.5H21.5V13.5H16.5V6.5Z" fill="#505ac9" />
      <circle cx="19" cy="4.5" r="1.8" fill="#505ac9" />
      <rect x="2.5" y="5" width="13.5" height="14" rx="3" fill="#464eb8" />
      <path d="M6.5 9H12M9.25 9V15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LinearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#181825" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M6 18C12 18 18 12 18 6" stroke="#5e6ad2" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" fill="#5e6ad2" />
    </svg>
  );
}

function ZendeskIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 6V18L10 18A6 6 0 0 0 4 6Z" fill="#03363d" />
      <path d="M20 18V6L14 6A6 6 0 0 0 20 18Z" fill="#03363d" />
      <circle cx="7" cy="6" r="3" fill="#00a656" />
      <circle cx="17" cy="18" r="3" fill="#00a656" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 5.5A16.5 16.5 0 0 0 15.5 4.2C15.3 4.6 15.1 5.1 15 5.5A15.3 15.3 0 0 0 9 5.5C8.9 5.1 8.7 4.6 8.5 4.2A16.5 16.5 0 0 0 4.5 5.5C2 9.5 1.5 13.5 1.8 17.5A16.6 16.6 0 0 0 7 20C7.5 19.3 8 18.5 8.4 17.7C7.6 17.4 6.8 17 6.1 16.5C6.3 16.3 6.5 16.2 6.7 16A11.7 11.7 0 0 0 17.3 16C17.5 16.2 17.7 16.3 17.9 16.5C17.2 17 16.4 17.4 15.6 17.7C16 18.5 16.5 19.3 17 20A16.6 16.6 0 0 0 22.2 17.5C22.6 12.8 21.5 8.8 19.5 5.5ZM8.5 14C7.5 14 6.8 13.1 6.8 12C6.8 10.9 7.5 10 8.5 10C9.5 10 10.2 10.9 10.2 12C10.2 13.1 9.5 14 8.5 14ZM15.5 14C14.5 14 13.8 13.1 13.8 12C13.8 10.9 14.5 10 15.5 10C16.5 10 17.2 10.9 17.2 12C17.2 13.1 16.5 14 15.5 14Z"
        fill="#5865f2"
      />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#635bff" />
      <path d="M13.5 8.5C13.5 7.7 12.7 7.2 11.7 7.2C10.5 7.2 9.5 7.7 9 8.2L8.2 6.8C9 6.1 10.4 5.5 12 5.5C14.5 5.5 16 6.8 16 9C16 12 12.5 12.2 12.5 13.3C12.5 14 13.2 14.3 14 14.3C15 14.3 16.2 13.8 16.8 13.3L17.5 14.7C16.5 15.5 15.2 16 13.8 16C11.5 16 10 14.8 10 12.8C10 9.8 13.5 9.5 13.5 8.5Z" fill="#ffffff" />
    </svg>
  );
}

function ZapierIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2V22M3.5 7L20.5 17M3.5 17L20.5 7"
        stroke="#ff4a00"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.8" fill="#ff4a00" />
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12.5 2L3 13.5H11.5L11.5 22L21 10.5H12.5L12.5 2Z" fill="#3ecf8e" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2V22M2 12H22M5 5L19 19M5 19L19 5" stroke="#29b5e8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" fill="#29b5e8" />
    </svg>
  );
}

// Arrow Right SVG
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// =====================================================================
// Center 3D Isometric Stack Graphic
// =====================================================================

function IsometricStackGraphic() {
  return (
    <svg
      viewBox="0 0 320 490"
      className={styles.stackGraphicWrapper}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Soft radial glow filters */}
        <filter id="glowBlue" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glowPurple" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Level 1: Orchestration Gradients */}
        <linearGradient id="disc1Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="disc1Side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0a1b42" />
        </linearGradient>

        {/* Level 2: Models Gradients */}
        <linearGradient id="disc2Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="disc2Side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>

        {/* Level 3: Memory & Vectors Gradients */}
        <linearGradient id="disc3Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="disc3Side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>

        {/* Level 4: Cloud & Monitoring Gradients */}
        <linearGradient id="disc4Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="disc4Side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Background Central Dotted Light Axis */}
      <line
        x1="160"
        y1="25"
        x2="160"
        y2="465"
        stroke="rgba(56, 189, 248, 0.45)"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />

      {/* Top Beacon Pulse Node */}
      <circle cx="160" cy="24" r="5" fill="#38bdf8" filter="url(#glowBlue)" />
      <circle cx="160" cy="24" r="2.5" fill="#ffffff" />

      {/* =================================================================
          Level 4: Cloud & Monitoring (Bottom, y ~ 385)
          ================================================================= */}
      <g transform="translate(0, 360)">
        <ellipse
          cx="160"
          cy="36"
          rx="132"
          ry="44"
          fill="none"
          stroke="rgba(56, 189, 248, 0.18)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
        />
        <ellipse cx="160" cy="56" rx="90" ry="32" fill="rgba(0, 0, 0, 0.6)" filter="url(#glowBlue)" />
        <path
          d="M 72 36 A 88 32 0 0 0 248 36 L 248 54 A 88 32 0 0 1 72 54 Z"
          fill="url(#disc4Side)"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1"
        />
        <ellipse
          cx="160"
          cy="36"
          rx="88"
          ry="32"
          fill="url(#disc4Top)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.2"
        />
        <ellipse cx="160" cy="36" rx="66" ry="24" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        <g transform="translate(148, 22)">
          <path
            d="M 19 14 A 4 4 0 0 0 16 7 A 6 6 0 0 0 5 10 A 4.5 4.5 0 0 0 6 19 L 19 19 A 3.5 3.5 0 0 0 19 14 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
        <text
          x="160"
          y="56"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="0.02em"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Cloud &amp; Monitoring
        </text>
      </g>

      {/* =================================================================
          Level 3: Memory & Vectors (y ~ 260)
          ================================================================= */}
      <g transform="translate(0, 255)">
        <ellipse
          cx="160"
          cy="36"
          rx="132"
          ry="44"
          fill="none"
          stroke="rgba(192, 132, 252, 0.22)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
        />
        <ellipse cx="160" cy="36" rx="88" ry="32" fill="rgba(124, 58, 237, 0.3)" filter="url(#glowPurple)" />
        <path
          d="M 72 36 A 88 32 0 0 0 248 36 L 248 54 A 88 32 0 0 1 72 54 Z"
          fill="url(#disc3Side)"
          stroke="rgba(192, 132, 252, 0.4)"
          strokeWidth="1"
        />
        <ellipse
          cx="160"
          cy="36"
          rx="88"
          ry="32"
          fill="url(#disc3Top)"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.2"
        />
        <ellipse cx="160" cy="36" rx="66" ry="24" fill="none" stroke="rgba(233, 213, 255, 0.4)" strokeWidth="1" />
        <g transform="translate(148, 21)">
          <ellipse cx="12" cy="7" rx="8" ry="3.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d="M 4 7 V 17 A 8 3.5 0 0 0 20 17 V 7" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d="M 4 12 A 8 3.5 0 0 0 20 12" fill="none" stroke="#ffffff" strokeWidth="1.6" />
        </g>
        <text
          x="160"
          y="56"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="0.02em"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Memory &amp; Vectors
        </text>
      </g>

      {/* =================================================================
          Level 2: Models (y ~ 150)
          ================================================================= */}
      <g transform="translate(0, 150)">
        <ellipse
          cx="160"
          cy="36"
          rx="132"
          ry="44"
          fill="none"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
        />
        <ellipse cx="160" cy="36" rx="88" ry="32" fill="rgba(2, 132, 199, 0.35)" filter="url(#glowCyan)" />
        <path
          d="M 72 36 A 88 32 0 0 0 248 36 L 248 54 A 88 32 0 0 1 72 54 Z"
          fill="url(#disc2Side)"
          stroke="rgba(56, 189, 248, 0.45)"
          strokeWidth="1"
        />
        <ellipse
          cx="160"
          cy="36"
          rx="88"
          ry="32"
          fill="url(#disc2Top)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.2"
        />
        <ellipse cx="160" cy="36" rx="66" ry="24" fill="none" stroke="rgba(224, 242, 254, 0.45)" strokeWidth="1" />
        <g transform="translate(148, 21)">
          <path d="M 12 3 L 20 7.5 V 16.5 L 12 21 L 4 16.5 V 7.5 Z" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d="M 12 12 L 20 7.5 M 12 12 L 4 7.5 M 12 12 V 21" stroke="#ffffff" strokeWidth="1.5" />
        </g>
        <text
          x="160"
          y="56"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="0.02em"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Models
        </text>
      </g>

      {/* =================================================================
          Level 1: Orchestration (Top, y ~ 45)
          ================================================================= */}
      <g transform="translate(0, 45)">
        <ellipse
          cx="160"
          cy="36"
          rx="132"
          ry="44"
          fill="none"
          stroke="rgba(96, 165, 250, 0.3)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
        />
        <ellipse cx="160" cy="36" rx="88" ry="32" fill="rgba(37, 99, 235, 0.5)" filter="url(#glowBlue)" />
        <path
          d="M 72 36 A 88 32 0 0 0 248 36 L 248 54 A 88 32 0 0 1 72 54 Z"
          fill="url(#disc1Side)"
          stroke="rgba(96, 165, 250, 0.6)"
          strokeWidth="1"
        />
        <ellipse
          cx="160"
          cy="36"
          rx="88"
          ry="32"
          fill="url(#disc1Top)"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.3"
        />
        <ellipse cx="160" cy="36" rx="66" ry="24" fill="none" stroke="rgba(219, 234, 254, 0.55)" strokeWidth="1" />
        <g transform="translate(148, 21)">
          <circle cx="12" cy="7" r="2.5" fill="#ffffff" />
          <circle cx="7" cy="16" r="2.5" fill="#ffffff" />
          <circle cx="17" cy="16" r="2.5" fill="#ffffff" />
          <path d="M 12 7 L 7 16 M 12 7 L 17 16 M 7 16 L 17 16" stroke="#ffffff" strokeWidth="1.5" />
        </g>
        <text
          x="160"
          y="56"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="0.02em"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Orchestration
        </text>
      </g>
    </svg>
  );
}

// =====================================================================
// Main TechStackSection Component
// =====================================================================

const TOOL_ICONS: Record<string, () => React.JSX.Element> = {
  "LangGraph": LangGraphIcon,
  "CrewAI": CrewAIIcon,
  "AutoGen": AutoGenIcon,
  "LlamaIndex": LlamaIndexIcon,
  "Semantic Kernel": SemanticKernelIcon,
  "OpenAI": OpenAIIcon,
  "Anthropic Claude": ClaudeIcon,
  "Google Gemini": GeminiIcon,
  "Meta Llama": MetaLlamaIcon,
  "Mistral": MistralIcon,
  "Postgres pgvector": PostgresIcon,
  "Pinecone": PineconeIcon,
  "Qdrant": QdrantIcon,
  "Weaviate": WeaviateIcon,
  "Redis": RedisIcon,
  "AWS Bedrock": AWSBedrockIcon,
  "Azure AI Foundry": AzureFoundryIcon,
  "LangSmith": LangSmithIcon,
  "Arize Phoenix": ArizeIcon,
  "OpenTelemetry": OpenTelemetryIcon,
  "Slack": SlackIcon,
  "Notion": NotionIcon,
  "Google Drive": GoogleDriveIcon,
  "GitHub": GitHubIcon,
  "Figma": FigmaIcon,
  "Jira": JiraIcon,
  "HubSpot": HubSpotIcon,
  "Salesforce": SalesforceIcon,
  "Microsoft Teams": MSTeamsIcon,
  "Linear": LinearIcon,
  "Zendesk": ZendeskIcon,
  "Discord": DiscordIcon,
  "Stripe": StripeIcon,
  "Zapier": ZapierIcon,
  "Supabase": SupabaseIcon,
  "Snowflake": SnowflakeIcon,
};

/** Brand mark for a tool, or its first letter when the tool has no bundled logo. */
function ToolMark({ name }: { name: string }) {
  const Icon = TOOL_ICONS[name];
  if (Icon) return <Icon />;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#2563eb" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
        {name.trim().charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}

export interface StackContent {
  title: string;
  lead: string;
  badges: { title: string; desc: string }[];
  groups: { title: string; desc: string; items: string[] }[];
  integrationsTitle: string;
  integrations: string[];
  moreLabel: string;
  moreIntegrations: string[];
}

function tailSplit(title: string) {
  const words = title.trim().split(/\s+/);
  const accentCount = words.length > 3 ? 2 : 1;
  return { plain: words.slice(0, words.length - accentCount).join(" "), accent: words.slice(-accentCount).join(" ") };
}

function ToolTiles({ items }: { items: string[] }) {
  return (
    <div className={styles.toolsGrid}>
      {items.map((name) => (
        <div key={name} className={styles.toolTile} title={name}>
          <div className={styles.toolIconWrap}>
            <ToolMark name={name} />
          </div>
          <span className={styles.toolName}>{name}</span>
        </div>
      ))}
    </div>
  );
}

function IntegrationTiles({ items }: { items: string[] }) {
  return (
    <>
      {items.map((name) => (
        <div key={name} className={styles.integrationTile} title={name} role="img" aria-label={name}>
          <ToolMark name={name} />
          <span className={styles.tooltip}>{name}</span>
        </div>
      ))}
    </>
  );
}

export function TechStackSection({ data }: { data: StackContent }) {
  const groups = data.groups ?? [];
  const badges = data.badges ?? [];
  const head = tailSplit(data.title);
  const intro = tailSplit(data.integrationsTitle);
  const [showMore, setShowMore] = useState(false);

  return (
    <section className={styles.stackSection} id="stack" aria-labelledby="tech-stack-title">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.wrap}>
        {/* -------------------------------------------------------- Header */}
        <div className={styles.headerRow}>
          <div className={styles.headerCopy}>
            <h2 id="tech-stack-title" className={styles.mainTitle}>
              {head.plain} <span className={styles.titleBlue}>{head.accent}</span>
            </h2>
            <p className={styles.leadText}>{data.lead}</p>
          </div>

          {/* Top-Right 3 Value Badges */}
          <div className={styles.featureBadges}>
            {/* Feature 1 */}
            <div className={styles.featureBadge}>
              <div className={styles.featureIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>{badges[0]?.title}</span>
                <span className={styles.featureDesc}>{badges[0]?.desc}</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureBadge}>
              <div className={styles.featureIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>{badges[1]?.title}</span>
                <span className={styles.featureDesc}>{badges[1]?.desc}</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureBadge}>
              <div className={styles.featureIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>{badges[2]?.title}</span>
                <span className={styles.featureDesc}>{badges[2]?.desc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- Main 3-Column Canvas */}
        <div className={styles.techCanvas}>
          <div className={styles.techCanvasGlow} aria-hidden="true" />

          <div className={styles.techGrid}>
            {/* Left Column: 01 & 03 */}
            <div className={styles.cardsColumn}>
              {/* Card 01: Orchestration */}
              <div className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNumBadge}>01</div>
                  <div className={styles.cardHeaderText}>
                    <h3 className={styles.cardTitle}>{groups[0]?.title}</h3>
                    <p className={styles.cardDesc}>{groups[0]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                <ToolTiles items={groups[0]?.items ?? []} />
              </div>

              {/* Card 03: Memory and vectors */}
              <div className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNumBadge}>03</div>
                  <div className={styles.cardHeaderText}>
                    <h3 className={styles.cardTitle}>{groups[2]?.title}</h3>
                    <p className={styles.cardDesc}>{groups[2]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                <ToolTiles items={groups[2]?.items ?? []} />
              </div>
            </div>

            {/* Center Column: 3D Stack Graphic */}
            <div className={styles.stackCenterCol}>
              <IsometricStackGraphic />
            </div>

            {/* Right Column: 02 & 04 */}
            <div className={styles.cardsColumn}>
              {/* Card 02: Models */}
              <div className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNumBadge}>02</div>
                  <div className={styles.cardHeaderText}>
                    <h3 className={styles.cardTitle}>{groups[1]?.title}</h3>
                    <p className={styles.cardDesc}>{groups[1]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                <ToolTiles items={groups[1]?.items ?? []} />
              </div>

              {/* Card 04: Cloud and monitoring */}
              <div className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNumBadge}>04</div>
                  <div className={styles.cardHeaderText}>
                    <h3 className={styles.cardTitle}>{groups[3]?.title}</h3>
                    <p className={styles.cardDesc}>{groups[3]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                <ToolTiles items={groups[3]?.items ?? []} />
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- Bottom Integrations Bar (inside canvas) */}
          <div className={styles.integrationsBanner}>
            <div className={styles.integrationsTopRow}>
              <div className={styles.integrationsCopy}>
                <h3 className={styles.integrationsTitle}>
                  {intro.plain} <span className={styles.integrationsHighlight}>{intro.accent}</span>
                </h3>
              </div>

              <div className={styles.integrationsRow}>
                <IntegrationTiles items={data.integrations ?? []} />

                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className={styles.moreIntegrationsBtn}
                  aria-expanded={showMore}
                >
                  {showMore ? (
                    <>
                      Show less <span className={styles.moreArrow}>↑</span>
                    </>
                  ) : (
                    <>
                      and many more... <span className={styles.moreArrow}>+</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded integrations panel */}
            {showMore ? (
              <div className={styles.expandedIntegrations}>
                <div className={styles.expandedLabel}>
                  <span>{data.moreLabel}</span>
                </div>
                <div className={styles.integrationsRow}>
                  <IntegrationTiles items={data.moreIntegrations ?? []} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
