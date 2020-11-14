import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';
import { ContextType } from '../types';

async function createPost(title: string, { em }: ContextType): Promise<Post> {
  const post = em.create(Post, { title });
  await em.persistAndFlush(post);
  return post;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: ContextType): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: ContextType,
  ): Promise<Post | null> {
    return em.findOne(Post, { id: { $eq: id } });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: ContextType,
  ): Promise<Post> {
    return createPost(title, { em });
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('title') title: string,
    @Arg('id') id: number,
    @Ctx() { em }: ContextType,
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id: { $eq: id } });
    if (!post) {
      return null;
    }
    if (title) post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: ContextType,
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id: { $eq: id } });
    return true;
  }
}
