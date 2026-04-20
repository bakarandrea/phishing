import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/alerts', async (req, res) => {
    const { detection } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPhone = process.env.ADMIN_PHONE;

    if (!detection || detection.isSafe) {
      return res.status(400).json({ error: 'No threat detected' });
    }

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // 1. Send Email Alert via Resend
    if (process.env.RESEND_API_KEY && adminEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
          from: 'PythonicBoy Security <onboarding@resend.dev>',
          to: [adminEmail],
          subject: `⚠️ SECURITY ALERT: ${detection.threatType} Detected`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
              <h2 style="color: #dc2626; text-transform: uppercase;">Threat Intelligence Alert</h2>
              <p>An urgent security threat has been intercepted by the PythonicBoy University AI Engine.</p>
              <div style="background: #fef2f2; padding: 16px; border-radius: 8px; border: 1px solid #fee2e2;">
                <p><strong>Threat Type:</strong> ${detection.threatType}</p>
                <p><strong>Risk Score:</strong> ${detection.score}%</p>
                <p><strong>Detected At:</strong> ${new Date(detection.timestamp).toLocaleString()}</p>
                <p><strong>Content Snippet:</strong><br/> <em>"${detection.content.substring(0, 200)}..."</em></p>
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
                Please log in to the Security Command Center for full forensic analysis.
              </p>
            </div>
          `,
        });

        if (error) {
          results.errors.push(`Email error: ${error.message}`);
        } else {
          results.emailSent = true;
        }
      } catch (err: any) {
        results.errors.push(`Email exception: ${err.message}`);
      }
    }

    // 2. Send SMS Alert via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER && adminPhone) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `⚠️ PythonicBoy Alert: ${detection.threatType} Intercepted! Risk: ${detection.score}%. Check Dashboard immediately.`,
          from: process.env.TWILIO_FROM_NUMBER,
          to: adminPhone,
        });
        results.smsSent = true;
      } catch (err: any) {
        results.errors.push(`SMS exception: ${err.message}`);
      }
    }

    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false // Disable HMR to stop websocket errors
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
