import { Express } from 'express';

export interface Routes {
    init(app: Express): void;
}
