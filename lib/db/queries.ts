import { desc, and, eq, isNull, asc } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, users, tasks, type NewTask } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      metadata: activityLogs.metadata,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

// Task management functions
export async function getUserTasks() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, user.id), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.createdAt));
}

export async function getTask(taskId: number) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const task = await db
    .select()
    .from(tasks)
    .where(and(
      eq(tasks.id, taskId),
      eq(tasks.userId, user.id),
      isNull(tasks.deletedAt)
    ))
    .limit(1);

  return task.length > 0 ? task[0] : null;
}

export async function createTask(taskData: Omit<NewTask, 'userId'>) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const [newTask] = await db
    .insert(tasks)
    .values({
      ...taskData,
      userId: user.id,
    })
    .returning();

  return newTask;
}

export async function updateTask(taskId: number, updates: Partial<Omit<NewTask, 'userId' | 'id'>>) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const [updatedTask] = await db
    .update(tasks)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(
      eq(tasks.id, taskId),
      eq(tasks.userId, user.id),
      isNull(tasks.deletedAt)
    ))
    .returning();

  return updatedTask;
}

export async function deleteTask(taskId: number) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const [deletedTask] = await db
    .update(tasks)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(tasks.id, taskId),
      eq(tasks.userId, user.id),
      isNull(tasks.deletedAt)
    ))
    .returning();

  return deletedTask;
}

export async function getTasksByStatus(status: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, user.id),
      eq(tasks.status, status),
      isNull(tasks.deletedAt)
    ))
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksByPriority(priority: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, user.id),
      eq(tasks.priority, priority),
      isNull(tasks.deletedAt)
    ))
    .orderBy(desc(tasks.createdAt));
}