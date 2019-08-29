import { typeDefs as chat } from './chat/typedefs';
import { typeDefs as defaultTypeDefs } from './default/typedefs';
import { typeDefs as list } from './list/typedefs';
import { typeDefs as randomizr } from './randomizr/typedefs';
import { typeDefs as user } from './user/typedefs';

export const rootTypeDefs = [
    user,
    chat,
    defaultTypeDefs,
    list,
    randomizr,
];
