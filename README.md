# MedRoute — Geospatially Optimized Pharmaceutical Redistribution Network

**Live MVP:** [medroute-psi.vercel.app](https://medroute-psi.vercel.app)

MedRoute is a web-based, AI-powered platform that redistributes surplus/unused medicines to people who need them. It connects **donors**, **NGOs / collection points**, **receivers**, and **government authorities** through one role-based system — verifying donated medicines with computer vision + OCR, authenticating receivers via Ayushman Bharat ID (ABHA), matching supply to demand with geospatial routing, and offering a multilingual voice/text interface so it's usable by anyone, regardless of language or literacy level.

India discards ₹2,000+ crores worth of medicines every year while low-income, rural, and elderly populations struggle to access essential medicines. MedRoute exists to close that gap with a verified, transparent, scalable redistribution pipeline.

---

## Core Modules

1. **Donor Module** — Donors upload front/back images of medicine packaging. A YOLOv8n + OCR pipeline detects pills, classifies pack status (opened/sealed), and extracts medicine name, batch number, and expiry date.
2. **Receiver Module** — Multilingual interface for requesting medicines. Receivers verify identity via ABHA ID and upload a prescription for doctor review before allocation.
3. **Central Database (Supabase)** — Stores verified medicines, requests, users, and tracking logs.
4. **Allocation & Geospatial Mapping Module** — Matches medicines to receivers by type, need, expiry, and proximity (bounding-box pre-filter + Google Maps Distance Matrix ranking).
5. **Tracking & Logistics Module** — Real-time delivery tracking via NGOs.
6. **Government Module** — Oversight, monitoring, and final decision-making authority; the platform only ever surfaces AI-generated suggestions, never autonomous decisions.
7. **Multilingual AI Layer (Sarvam + Groq)** — Voice/text interaction and prescription analysis, see below.
8. **Disaster-Aware Routing & Governance Layer** — AI-assisted, PIN-verified emergency routing with full human authority retained.
9. **Delivery Route Optimization** — Google Maps API + Dijkstra's shortest-path algorithm for fastest dispatch routes.

## AI Provider Strategy: Sarvam (primary) → Groq (fallback)

- **Sarvam AI** is the primary engine for multilingual voice/text interaction (Indian languages) and prescription/medicine analysis, since it's purpose-built for Indian-language understanding.
- Sarvam's free tier is capped at **10 calls/day**, so once that quota is exhausted, the app automatically **falls back to Groq**.
- **Groq** also independently handles prescription analysis — reading and interpreting prescription details (medicine names, dosage, doctor notes) — as a secondary/backup analysis path so the pipeline doesn't break when Sarvam is rate-limited.
- This means every AI-dependent flow (chat interface, prescription review, medicine analysis) should be wired with: **try Sarvam → on quota/error → retry with Groq**.

## Tech Stack

| Category | Tools |
|---|---|
| AI & Verification | YOLOv8 (pill detection), EasyOCR (text extraction), Sarvam API (primary AI), Groq (fallback AI + prescription analysis), Gemini (supplementary) |
| Platform | React + TypeScript (frontend), Node.js + Express.js (backend/API) |
| Database & Auth | Supabase (database + auth), Firebase Auth (role claims), Ayushman ID (ABHA) verification |
| Geospatial | Google Maps API, Distance Matrix API, custom distance-based matching |
| Deployment | Vercel (frontend), Render (backend) |

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# AI Providers
GROQ_API_KEY=            # Fallback AI + prescription analysis
GEMINI_API_KEY=          # Supplementary AI analysis
SARVAM_API=              # Primary multilingual AI (10 calls/day free-tier limit)

# ML Model
YOLOV8_MODEL_WEIGHTS_URL= # Custom-trained YOLOv8 weights (best.pt) for pill detection/counting

# Database
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

>  Never commit real keys. Keep `.env` out of version control (`.gitignore`) 

## Suggested Repo Structure

```
medroute/
├── frontend/                # React + TypeScript app (Vercel)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── donor/
│   │   │   ├── receiver/
│   │   │   ├── ngo/
│   │   │   └── government/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── backend/                  # Node.js + Express API (Render)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ocr/          # YOLOv8 + EasyOCR pipeline
│   │   │   ├── ai/           # Sarvam-primary / Groq-fallback logic
│   │   │   └── geospatial/   # bounding-box + Distance Matrix allocation
│   │   └── middleware/
│   └── package.json
├── ml/                       # Model training notebooks, YOLO weights
├── .env.example
└── README.md
```

## Methodology Highlights

- **Medicine verification**: front-side image → YOLOv8n pill detection/counting + pack status; back-side image → EasyOCR text extraction (name, batch, expiry) after grayscale → denoise → Otsu threshold → deskew preprocessing. Splitting front/back images fixed earlier failures detecting sealed packs from a single image.
- **Expiry classification**: rule-based — Expired (rejected), Urgent (≤90 days), Soon (91–180), Within a Year (181–365), Safe (>365).
- **Geospatial allocation**: 50 km bounding-box pre-filter → rank by real driving time via Google Maps Distance Matrix API → allocate nearest match + nearest NGO for delivery. Cuts DB reads/API calls by ~87%, ~1.34s average allocation time.
- **Future scope**: exploring Duan et al. (2025) deterministic O(m·log^(2/3) n) shortest-path algorithm as a potential replacement for Dijkstra's O(m + n log n) for large-scale routing.

## Local Setup
 
```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/medroute.git
cd medroute
 
# 2. Install frontend dependencies
cd frontend
npm install
 
# 3. Install backend dependencies
cd ../backend
npm install
 
# 4. Set up environment variables
cp .env.example .env
# then fill in GROQ_API_KEY, GEMINI_API_KEY, SARVAM_API,
# YOLOV8_MODEL_WEIGHTS_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 
# 5. Download YOLOv8 pill-detection weights
# (linked via YOLOV8_MODEL_WEIGHTS_URL in .env — place the downloaded
# best.pt inside backend/ml/weights/)
 
# 6. Run backend (from /backend)
npm run dev
 
# 7. Run frontend (from /frontend, in a separate terminal)
npm run dev
```
 
The frontend runs on `http://localhost:5173` (Vite default) and proxies API calls to the backend on `http://localhost:5000` — adjust ports in `.env` / `vite.config.ts` if needed.
 
### Testing the Detection Pipeline
 
To try out the donor-side verification flow (YOLOv8 pill detection + EasyOCR extraction) without needing a real donor, use sample **blister pack images** — front-side (pills visible, for detection/counting) and back-side (text/foil, for OCR extraction of name, batch, expiry).
 
- Sample/test blister pack images are included in `/Resources_medroute` (attached in this repo) — use these to sanity-check the pipeline after setup.
- For your own test images: capture one **front image** (unobstructed view of the pills) and one **back image** (medicine name, batch number, expiry date clearly visible) per pack, matching the same two-image flow the Donor Module expects.
- Recommended: test with a mix of sealed and opened packs, and a few rotated/low-light shots, since that's what the OCR preprocessing pipeline (grayscale → denoise → Otsu threshold → deskew) is tuned to handle.


## Vision

Every verified medicine redistributed brings us one step closer to a healthier, more sustainable, and equitable India.
