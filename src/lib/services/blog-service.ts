import { prisma } from "@/lib/db";
import { BlogPost } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Service to manage blog posts in the database.
 */

export async function getPublishedPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllPosts() {
  return await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function upsertPost(data: Partial<BlogPost> & { slug: string }) {
  const { slug, ...rest } = data;
  
  const result = await prisma.blogPost.upsert({
    where: { slug },
    update: rest,
    create: {
      slug,
      title: rest.title || "",
      excerpt: rest.excerpt || "",
      content: rest.content || "",
      author: rest.author || "RepoMind Engineering",
      category: rest.category || "Engineering",
      image: rest.image || "/preview_example.png",
      date: rest.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      published: rest.published ?? false,
    },
  });

  // Revalidate public blog paths
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return result;
}

export async function deletePost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true },
  });

  const result = await prisma.blogPost.delete({
    where: { id },
  });

  if (post?.slug) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
  }

  return result;
}
