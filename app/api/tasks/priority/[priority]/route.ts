import { NextRequest, NextResponse } from 'next/server';
import { getTasksByPriority } from '@/lib/db/queries';

// GET /api/tasks/priority/[priority] - Get tasks by priority
export async function GET(
  request: NextRequest,
  { params }: { params: { priority: string } }
) {
  try {
    const priority = params.priority;
    
    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high' },
        { status: 400 }
      );
    }

    const tasks = await getTasksByPriority(priority);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by priority:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}