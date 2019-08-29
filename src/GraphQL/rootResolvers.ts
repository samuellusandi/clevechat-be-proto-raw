import { merge } from 'lodash';

import { resolvers as chatResolver } from './chat/resolver';
import { resolvers as defaultResolver } from './default/resolver';
import { resolvers as list } from './list/resolver';
import { resolvers as randomizr } from './randomizr/resolver';
import { resolvers as user } from './user/resolver';

export const rootResolvers = merge(
    user,
    chatResolver,
    defaultResolver,
    list,
    randomizr,
);
