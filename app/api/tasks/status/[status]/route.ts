import { NextRequest, NextResponse } from 'next/server';
import { getTasksByStatus } from '@/lib/db/queries';

// GET /api/tasks/status/[status] - Get tasks by status
export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  try {
    const status = params.status;
    
    // Validate status
    if (!['todo', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: todo, in_progress, completed' },
        { status: 400 }
      );
    }

    const tasks = await getTasksByStatus(status);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}