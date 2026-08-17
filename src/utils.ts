import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { Material } from "./types";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function calculateLeftover(mat: Material): number {
  const leftover = mat.totalPurchased - mat.totalUsed - (mat.totalResold || 0);
  return Math.max(0, Number(leftover.toFixed(2)));
}

export function getLeftoverStockValue(mat: Material): number {
  return calculateLeftover(mat) * mat.unitCost;
}

export async function generateWorkerQRCode(workerBadgeId: string, workerName: string, siteId: string): Promise<string> {
  const payload = JSON.stringify({
    badgeId: workerBadgeId,
    name: workerName,
    siteId,
    timestamp: Date.now(),
    verified: "BUILDWISE_AUTH_V1",
  });
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      width: 260,
      margin: 1.5,
      color: {
        dark: "#1e293b",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("Failed to generate QR code", err);
    return "";
  }
}

export function triggerConfetti() {
  confetti({
    particleCount: 75,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#2563eb", "#10b981", "#f59e0b", "#6366f1"],
  });
}
