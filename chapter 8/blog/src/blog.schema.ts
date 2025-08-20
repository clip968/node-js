import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop()
    name: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);