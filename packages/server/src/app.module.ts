import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BlogModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
