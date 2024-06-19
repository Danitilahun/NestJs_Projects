import { Query, Resolver } from "@nestjs/graphql";


@Resolver( of => String)
export class AppResolver{
    //@Query('books') // schema first approach
    @Query(returns => String)
    index(): string{
        return "NestJS GraphQL Server";
    }
}