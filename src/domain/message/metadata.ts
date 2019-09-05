import { Metadata } from 'src/core/helpers/object_with_meta';

export interface MessageMetadata extends Metadata {
    pageState: string;
}
