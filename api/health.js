// Vercel Serverless Function - Health Check
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'LifeOS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
}
