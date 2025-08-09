import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getUser } from '@/lib/db/queries';
import TaskDashboard from '@/components/task-dashboard';

export default async function HomePage() {
  const user = await getUser();

  // Show task dashboard for authenticated users
  if (user) {
    return (
      <main className="flex-1">
        <TaskDashboard />
      </main>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <main className="flex-1 flex items-center justify-center">
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl">
            Welcome to
            <span className="block text-primary">TaskMaster Pro</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Your ultimate task management solution with advanced features, priority tracking, and seamless organization.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="text-lg rounded-full px-8 py-3"
            >
              <a href="/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Advanced Task Management</h3>
              <p className="text-muted-foreground">Create tasks with priorities, deadlines, tags, and detailed descriptions.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Smart Organization</h3>
              <p className="text-muted-foreground">Filter and sort tasks by status, priority, and custom tags for better organization.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">Track your progress with intuitive status updates and completion analytics.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}