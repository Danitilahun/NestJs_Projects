import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class AddBookArgs{
    
    @Field()
    title: string;

    @Field((type)=> Int)
    price: number;

    @Field()
    genres: string;
}