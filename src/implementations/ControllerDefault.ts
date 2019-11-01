import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../interfaces/Controller';

@injectable()
export class ControllerDefault implements Controller {
    public async control(_req: Request, res: Response): Promise<void> {
        try {
            res.render('notes.hbs', {
                note: 'asd',
            });
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
        }
    }
}
