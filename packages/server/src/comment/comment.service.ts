import { Injectable } from '@nestjs/common';
import { Prisma } from 'shared/src/generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateCommentDto) {
    return this.prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.commentWhereUniqueInput;
    where?: Prisma.commentWhereInput;
    orderBy?: Prisma.commentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.comment.findMany({
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
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findOne(where: Prisma.commentWhereUniqueInput) {
    return this.prisma.comment.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async update(where: Prisma.commentWhereUniqueInput, data: UpdateCommentDto) {
    return this.prisma.comment.update({
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
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(where: Prisma.commentWhereUniqueInput) {
    return this.prisma.comment.delete({
      where,
    });
  }
}
