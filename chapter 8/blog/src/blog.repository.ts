import { PostDto } from "./blog.model";
import { readFile, writeFile } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "./blog.schema";
import { InjectModel } from "@nestjs/mongoose";

export interface Blogrepository{
    getAllPosts(): Promise<PostDto[]>;
    createPost(postDto: PostDto): Promise<any>;
    getPost(id: string): Promise<PostDto>;
    deletePost(id: string): Promise<void>;
    updatePost(id: string, postDto: PostDto): Promise<void>;
}

@Injectable()
export class BlogFileRepository implements Blogrepository{
    FILE_NAME = './src/blog.data.json';

    async getAllPosts(): Promise<PostDto[]> {
        try {
            const datas = await readFile(this.FILE_NAME, 'utf-8');
            // 빈 파일이면 빈 배열 반환
            if (!datas.trim()) {
                return [];
            }
            const posts = JSON.parse(datas);
            return posts;
        } catch (error) {
            // 파일이 없으면 빈 배열 반환
            return [];
        }
    }

    async createPost(postDto: PostDto): Promise<any> {
        const posts = await this.getAllPosts();
        const id = posts.length + 1;
        const createdPost = {...postDto, id: id.toString(), createdAt: new Date()};
        posts.push(createdPost);
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
        return createdPost;
    }
    async getPost(id: string): Promise<PostDto> {
        const posts = await this.getAllPosts();
        const result = posts.find((post) => post.id === id);
        return result!;
    }
    async deletePost(id: string): Promise<void> {
        const posts = await this.getAllPosts();
        const filteredPosts = posts.filter((post) => post.id !== id);
        await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
    }

    async updatePost(id: string, postDto: PostDto): Promise<void> {
        const posts = await this.getAllPosts();
        const updateIndex = posts.findIndex((post) => post.id === id);
        const updatePost = {
            ...postDto,
            id,
            updatedDt: new Date()
        };
        posts[updateIndex] = updatePost;
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
    }
}

@Injectable()
export class BlogMongoRepository implements Blogrepository{
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

    async getAllPosts() : Promise<Blog[]> {
        return await this.blogModel.find().exec();
    }

    async createPost(postDto: PostDto): Promise<Blog> {
        const createdPost = new this.blogModel({
            ...postDto,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await createdPost.save();
    }

    async getPost(id: string): Promise<PostDto> {
        const result = await this.blogModel.findById(id);
        return result!;
    }

    async deletePost(id: string): Promise<void> {
        await this.blogModel.findByIdAndDelete(id);
    }

    async updatePost(id: string, postDto: PostDto): Promise<void> {
        const updatePost = {...postDto, updatedAt: new Date()};
        await this.blogModel.findByIdAndUpdate(id, updatePost);
    }
}