import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { LiveAlertBanner } from "@/components/guest-experience/LiveAlertBanner";
import { SentimentTrendChart } from "@/components/guest-experience/SentimentTrendChart";
import { TopicsBreakdown } from "@/components/guest-experience/TopicsBreakdown";
import { ComplaintsFeed } from "@/components/guest-experience/ComplaintsFeed";
import { getSession } from "@/lib/auth/session";
import { getReviewsComplaints, getReviewsSummary, getReviewsTopics, getReviewsTrends } from "@/lib/api/ml";

export default async function GuestExperiencePage() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <TopBar title="Guest Experience" />
        <p className="mt-6 text-sm text-muted-foreground">Sign in to view guest experience insights.</p>
      </>
    );
  }

  const [summary, topics, complaints, trends] = await Promise.all([
    getReviewsSummary(session.token).catch(() => null),
    getReviewsTopics(session.token).catch(() => ({ topics: [] })),
    getReviewsComplaints(session.token).catch(() => ({ complaints: [] })),
    getReviewsTrends(session.token).catch(() => ({ series: [] })),
  ]);

  return (
    <>
      <TopBar title="Guest Experience" subtitle="Sentiment, complaints and churn risk" dataSource="beta" />

      <div className="mt-6 space-y-6">
        <LiveAlertBanner token={session.token} />

        {summary && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-foreground">{summary.summary}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentTrendChart series={trends.series} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <TopicsBreakdown topics={topics.topics} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintsFeed token={session.token} complaints={complaints.complaints} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
