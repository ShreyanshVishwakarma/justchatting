import { NextRequest, NextResponse } from 'next/server';
import { redisCache } from '@/lib/redis';

// GET - Retrieve data from cache
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const data = await redisCache.get(key);
    
    return NextResponse.json({ 
      data,
      cached: data !== null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache GET error:', error);
    return NextResponse.json({ error: 'Cache retrieval failed' }, { status: 500 });
  }
}

// POST - Store data in cache
export async function POST(request: NextRequest) {
  try {
    const { key, data, ttl } = await request.json();

    if (!key || data === undefined) {
      return NextResponse.json({ error: 'Key and data are required' }, { status: 400 });
    }

    const success = await redisCache.set(key, data, ttl);
    
    return NextResponse.json({ 
      success,
      message: success ? 'Data cached successfully' : 'Failed to cache data'
    });
  } catch (error) {
    console.error('Cache POST error:', error);
    return NextResponse.json({ error: 'Cache storage failed' }, { status: 500 });
  }
}

// DELETE - Remove data from cache
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const success = await redisCache.del(key);
    
    return NextResponse.json({ 
      success,
      message: success ? 'Cache cleared successfully' : 'Failed to clear cache'
    });
  } catch (error) {
    console.error('Cache DELETE error:', error);
    return NextResponse.json({ error: 'Cache deletion failed' }, { status: 500 });
  }
}
