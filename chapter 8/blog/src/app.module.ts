import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogFileRepository, BlogMongoRepository } from './blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    MongooseModule.forRoot('mongodb+srv://namjaejun473:!operation050!@cluster0.se2kaea.mongodb.net/blog'),
    ],
  controllers: [BlogController],
  providers: [BlogService, BlogFileRepository, BlogMongoRepository],
})
export class AppModule {}
