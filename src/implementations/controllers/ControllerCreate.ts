import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import boolean from 'boolean';
import { Controller } from '../../interfaces/Controller';

@injectable()
export class ControllerCreate implements Controller {
    public async control(req: Request, res: Response): Promise<void> {
        try {
            const viewData = {
                title: 'Create Note',
                isDarkTheme: req.session ? boolean(req.session.isDarkTheme) : false,
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
