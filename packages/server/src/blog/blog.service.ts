import { Injectable } from '@nestjs/common';
import { Prisma } from 'shared/src/generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateBlogDto) {
    return this.prisma.blog.create({
      data: {
        ...data,
        id: data.id || undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.blogWhereUniqueInput;
    where?: Prisma.blogWhereInput;
    orderBy?: Prisma.blogOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.blog.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async findOne(where: Prisma.blogWhereUniqueInput) {
    return this.prisma.blog.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async update(where: Prisma.blogWhereUniqueInput, data: UpdateBlogDto) {
    return this.prisma.blog.update({
      where,
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async remove(where: Prisma.blogWhereUniqueInput) {
    return this.prisma.blog.delete({
      where,
    });
  }
}
