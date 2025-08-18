import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { cn, formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import NewsletterSignup from "@/components/newsletter-signup";
import BlurFade from "@/components/magicui/blur-fade";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { globalComponents } from "@/components/mdx";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${DATA.url}/blog/${post.slug}`,
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);
  const BLUR_FADE_DELAY = 0.04;

  if (!post) {
    notFound();
  }

  return (
    <>
    <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "fixed inset-0 h-full w-full skew-y-12",
        )}
      />
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/og?title=${post.metadata.title}`,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "s_chiriac",
              name: DATA.name,
            },
          }),
        }}
      />
      
      {/* Breadcrumbs */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li>
            <Link 
              href="/" 
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-neutral-400 dark:text-neutral-600">/</li>
          <li>
            <Link 
              href="/blog" 
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Blog
            </Link>
          </li>
          <li className="text-neutral-400 dark:text-neutral-600">/</li>
          <li className="text-neutral-900 dark:text-neutral-100 font-medium">
            {post.metadata.title}
          </li>
        </ol>
      </nav>

      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </div>
      
      <BlurFade delay={BLUR_FADE_DELAY}>
        <article className="prose dark:prose-invert">
          <MDXRemote 
            source={post.mdxContent} 
            components={globalComponents}
          />
        </article>
      </BlurFade>
      
      {/* Newsletter Signup */}
      <div className="mt-16">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <NewsletterSignup />
        </BlurFade>
      </div>
    </section>
    </>
  );
}
