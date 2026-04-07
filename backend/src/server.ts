// ============================================================
// src/server.ts — HTTP server entry point
// ============================================================

import app from './app';
import prisma from './utils/prismaClient';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`\n🚀 Task Management API`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ── Graceful Shutdown ────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

startServer();
