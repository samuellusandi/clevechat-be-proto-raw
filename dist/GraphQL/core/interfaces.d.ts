import { Context } from 'apollo-server-core';
import { GraphQLResolveInfo } from 'graphql';
export interface ResolverParams {
    obj: any;
    args: any[];
    context: Context;
    info: GraphQLResolveInfo;
}
