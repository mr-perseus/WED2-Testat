import { Request, Response } from 'express';

export interface Controller {
    control(req: Request, res: Response): Promise<void>;
}
