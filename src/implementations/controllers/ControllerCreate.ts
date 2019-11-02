import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../../interfaces/Controller';

@injectable()
export class ControllerCreate implements Controller {
    public async control(req: Request, res: Response): Promise<void> {
        try {
            const viewData = {
                title: 'Create Note',
                style: req.session ? req.session.style : null,
            };

            res.render('editNote.hbs', viewData);

            return await Promise.resolve();
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
            return Promise.reject();
        }
    }
}
