import { Controller, Param, Body, Get, Post, Put, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { PostDto } from './blog.model';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    @Get()
    getAllPosts() {
        console.log('모든 게시글 가져오기');
        return this.blogService.getAllPosts();
    }

    @Post()
    async createPost(@Body() postDto) {
        console.log('게시글 생성');
        const result = await this.blogService.createPost(postDto);
        return result;
    }

    @Get('/:id')
    async getPost(@Param('id') id: string) {
        console.log(`게시글 ${id} 가져오기`);
        
        const post = await this.blogService.getPost(id);
        console.log(post);
        return post;
    }
    
    @Delete('/:id')
    deletePost(@Param('id') id: string) {
        console.log(`게시글 삭제`);
        this.blogService.delete(id);
        return 'success';
    }

    @Put('/:id')
    updatePost(@Param('id') id: string, @Body() postDto) {
        console.log(`게시글 ${id} 수정`);
        return this.blogService.updatePost(id, postDto);
    }
}