"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import type { Dictionary } from "@/types/i18n";

interface Lesson {
  id: string;
  title: string;
  level?: string;
  description?: string;
}

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

interface UserProfileTabsProps {
  dictionary: Dictionary;
  bio?: string | null;
  subjects?: string[];
  levels?: string[];
  languages?: string[];
  lessons?: Lesson[];
  reviews?: Review[];
}

export function UserProfileTabs({
  dictionary,
  bio,
  subjects = [],
  levels = [],
  languages = [],
  lessons = [],
  reviews = [],
}: UserProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-muted/50 w-full justify-start p-1">
        <TabsTrigger value="overview" className="flex-1 sm:flex-none">
          {dictionary.profile.public.tabs.overview}
        </TabsTrigger>
        <TabsTrigger value="lessons" className="flex-1 sm:flex-none">
          {dictionary.profile.public.tabs.lessons}
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
          {dictionary.profile.public.tabs.reviews}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card className="border-border bg-card space-y-6 p-6">
          {bio && (
            <div className="space-y-2">
              <h3 className="text-foreground font-semibold">
                {dictionary.profile.public.sections.about}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <Section title={dictionary.profile.public.sections.subjects}>
              <TagList items={subjects} />
            </Section>
            <Section title={dictionary.profile.public.sections.levels}>
              <TagList items={levels} />
            </Section>
            <Section title={dictionary.profile.public.sections.languages}>
              <TagList items={languages} />
            </Section>
            <Section title={dictionary.profile.public.sections.availability}>
              <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                <span className="bg-muted rounded-full px-2.5 py-0.5">
                  {dictionary.profile.public.availability.weekdays}
                </span>
                <span className="bg-muted rounded-full px-2.5 py-0.5">
                  {dictionary.profile.public.availability.weekends}
                </span>
              </div>
            </Section>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="lessons">
        <div className="space-y-3">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <Card key={lesson.id} className="border-border bg-card/60 border">
                <div className="space-y-1 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">{lesson.title}</h3>
                    <span className="text-muted-foreground text-xs">
                      {lesson.level}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {lesson.description}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-muted/20 border-dashed">
              <div className="space-y-2 p-8 text-center">
                <div className="text-foreground text-sm font-medium">
                  {dictionary.profile.public.lessons.placeholderTitle}
                </div>
                <p className="text-muted-foreground text-xs">
                  {dictionary.profile.public.lessons.placeholderDescription}
                </p>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        <div className="space-y-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="border-border bg-card/60 border">
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">
                      {review.reviewerName}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927a1 1 0 011.902 0l1.07 3.296a1 1 0 00.95.69h3.462a1 1 0 01.588 1.81l-2.802 2.037a1 1 0 00-.364 1.118l1.07 3.296a1 1 0 01-1.541 1.118L10 13.347l-3.384 2.945a1 1 0 01-1.54-1.118l1.07-3.296a1 1 0 00-.364-1.118L2.98 8.723a1 1 0 01.588-1.81h3.462a1 1 0 00.95-.69l1.069-3.296z" />
                      </svg>
                      {review.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-muted/20 border-dashed">
              <div className="space-y-2 p-8 text-center">
                <div className="text-foreground text-sm font-medium">
                  {dictionary.profile.public.reviews.placeholderTitle}
                </div>
                <p className="text-muted-foreground text-xs">
                  {dictionary.profile.public.reviews.placeholderDescription}
                </p>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-foreground text-sm font-medium">{title}</h4>
      {children}
    </div>
  );
}

function TagList({ items }: { items?: string[] }) {
  if (!items || items.length === 0)
    return <p className="text-muted-foreground text-xs">-</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
