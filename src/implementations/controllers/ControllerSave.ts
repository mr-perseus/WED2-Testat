import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../../interfaces/Controller';
import { Types } from '../../types/Types';
import { Dal } from '../../interfaces/Dal';

@injectable()
export class ControllerSave implements Controller {
    private readonly dal: Dal;

    public constructor(
        @inject(Types.Dal)
        dal: Dal,
    ) {
        this.dal = dal;
    }

    public async control(req: Request, res: Response): Promise<void> {
        try {
            await this.dal.createOrUpdateNote(req.body);

            res.redirect('/');
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
        }
    }
}
