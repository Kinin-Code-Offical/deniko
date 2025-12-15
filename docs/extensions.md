# System Extensions

This document outlines potential future extensions to the Deniko system.

## 1. Real-time Messaging

- **Goal**: Allow students and teachers to chat.
- **Approach**: Use **Socket.io** with a custom server or a managed service like **Pusher**.
- **DB Impact**: New `Message` model with `senderId`, `receiverId`, `content`.
- **Risk**: Connection management in serverless environment (Next.js). May require a separate Node.js server or "Long Polling".

## 2. Video Streaming

- **Goal**: Host course videos.
- **Approach**: Do NOT use GCS for direct video streaming. Use **Mux** or **Cloudflare Stream**.
- **Integration**: Upload video -> Webhook -> Store `playbackId` in DB.

## 3. Payment Integration

- **Goal**: Paid courses.
- **Approach**: **Stripe** Checkout.
- **Flow**: User clicks "Buy" -> Redirect to Stripe -> Webhook (`checkout.session.completed`) -> Grant Access in DB.
