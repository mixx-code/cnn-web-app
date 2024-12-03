import os from 'os';
import { NextResponse } from 'next/server';

export async function GET() {
  const networkInterfaces = os.networkInterfaces();
  const macAddresses: string[] = [];

  Object.values(networkInterfaces).forEach((interfaces) => {
    interfaces?.forEach((details) => {
      if (details && details.mac && details.mac !== '00:00:00:00:00:00') {
        macAddresses.push(details.mac);
      }
    });
  });

  return NextResponse.json({ macAddresses });
}
