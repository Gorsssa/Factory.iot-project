import { prisma } from '@/lib/db';

export async function GET() {
  const data = await prisma.sensorData.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: 60, // Last 60 seconds of data
  });
  
  return new Response(JSON.stringify(data));
}

// Simulate sensor data (for development)
setInterval(async () => {
  await prisma.sensorData.create({
    data: {
      temperature: 20 + Math.random() * 5,
      humidity: 40 + Math.random() * 20,
    },
  });
}, 1000);