import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { generatePersonSchema } from "@/lib/json-ld";
import { env } from "@/lib/env";
import { UserProfileHero } from "@/components/users/user-profile-hero";
import { UserProfileTabs } from "@/components/users/user-profile-tabs";
import { internalApiFetch } from "@/lib/internal-api";
import { redirectToLogin, redirectToForbidden } from "@/lib/auth/redirects";
import { getAvatarSrc } from "@/lib/avatar";
import { parseJsonOrRedirect } from "@/lib/api-response";

interface UserProfilePageProps {
  params: Promise<{
    lang: Locale;
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { lang, username } = await params;
  const dictionary = await getDictionary(lang);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  try {
    const res = await internalApiFetch(`/public/users/${username}`);
    if (res.ok) {
      user = await res.json();
    }
  } catch (_e) {
    // ignore
  }

  if (!user) {
    return {
      title: dictionary.profile.public.notFound,
      robots: { index: false, follow: false },
    };
  }

  const globalNoIndex = env.NEXT_PUBLIC_NOINDEX;
  const profileVisibility = user.settings?.profileVisibility ?? "public";
  const showAvatar = user.settings?.showAvatar ?? true;
  const indexable = profileVisibility === "public" && !globalNoIndex;

  const title = dictionary.seo.profile.title.replace("{name}", user.name || "");

  let description = dictionary.seo.profile.description.generic.replace(
    "{name}",
    user.name || ""
  );

  if (user.role === "TEACHER") {
    description = dictionary.seo.profile.description.teacher.replace(
      "{name}",
      user.name || ""
    );
  } else if (user.role === "STUDENT") {
    description = dictionary.seo.profile.description.student.replace(
      "{name}",
      user.name || ""
    );
  }

  const url = `https://deniko.net/${lang}/users/${username}`;

  let imageUrl = user.image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    // Use API URL for internal images
    imageUrl = `${env.NEXT_PUBLIC_SITE_URL || "https://deniko.net"}${getAvatarSrc(user.id, user.avatarVersion)}`;
  }

  const ogImageUrl =
    showAvatar && imageUrl ? imageUrl : "https://deniko.net/og-image.png"; // Generic image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: user.name || "Deniko User",
        },
      ],
    },
    alternates: {
      canonical: url,
      languages: {
        tr: `https://deniko.net/tr/users/${username}`,
        en: `https://deniko.net/en/users/${username}`,
      },
    },
    robots: {
      index: indexable,
      follow: indexable,
      nocache: !indexable,
    },
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { lang, username } = await params;
  const dictionary = await getDictionary(lang);
  const session = await auth();

  const res = await internalApiFetch(`/public/users/${username}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await parseJsonOrRedirect<any>(res, { lang });

  const viewerId = session?.user?.id;
  const isOwner = viewerId === user.id;

  const { settings } = user;
  const profileVisibility = settings?.profileVisibility ?? "public";
  const isPrivate = profileVisibility === "private" && !isOwner;

  // Determine visibility of specific fields
  // Avatar is shown if:
  // 1. Viewer is owner
  // 2. OR (Profile is public AND Avatar is enabled on profile)
  const showAvatar =
    isOwner ||
    (profileVisibility === "public" && (settings?.showAvatar ?? true));
  const allowMessages = isOwner || (settings?.allowMessages ?? true);
  const showEmail = isOwner || (settings?.showEmail && !isPrivate);
  const showPhone = isOwner || (settings?.showPhone && !isPrivate);

  let imageUrl = user.image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = getAvatarSrc(user.id, user.avatarVersion);
  }

  // JSON-LD
  const globalNoIndex = env.NEXT_PUBLIC_NOINDEX;
  const indexable = profileVisibility === "public" && !globalNoIndex;
  const jsonLd = indexable
    ? generatePersonSchema(
        user.name || username,
        `https://deniko.net/${lang}/users/${username}`,
        showAvatar ? imageUrl : undefined
      )
    : null;

  // Prepare data for components
  const bio = user.teacherProfile?.bio || null;
  const subjects = user.teacherProfile?.branch
    ? [user.teacherProfile.branch]
    : [];
  const levels = user.studentProfile?.gradeLevel
    ? [user.studentProfile.gradeLevel]
    : [];

  // Mock stats for now (as requested to make it look full)
  const stats = {
    lessons: 0,
    students: 0,
    rating: "-",
  };

  if (isPrivate) {
    if (!session?.user) {
      redirectToLogin(lang, `/users/${username}`);
    } else {
      redirectToForbidden(lang);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <UserProfileHero
        user={{
          id: user.id,
          name: user.name,
          username: user.username,
          image: showAvatar ? imageUrl : null,
          role: user.role,
          country: user.preferredCountry,
          timezone: user.preferredTimezone,
          email: showEmail ? user.email : null,
          phone: showPhone ? user.phoneNumber : null,
        }}
        stats={stats}
        dictionary={dictionary}
        lang={lang}
        isOwner={isOwner}
        canMessage={allowMessages}
        canBookLesson={user.role === "TEACHER"}
      />

      <UserProfileTabs
        dictionary={dictionary}
        bio={bio}
        subjects={subjects}
        levels={levels}
        // Mock data for empty states
        lessons={[]}
        reviews={[]}
      />
    </div>
  );
}
