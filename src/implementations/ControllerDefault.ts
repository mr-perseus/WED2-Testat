import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../interfaces/Controller';

@injectable()
export class ControllerDefault implements Controller {
    public async control(_req: Request, res: Response): Promise<void> {
        try {
            res.send('success');
        } catch (error) {
            res.send(INTERNAL_SERVER_ERROR);
            res.send('Error');
        }
    }
}
