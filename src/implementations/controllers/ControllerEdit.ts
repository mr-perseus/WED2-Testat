import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../../interfaces/Controller';
import { Types } from '../../types/Types';
import { Dal } from '../../interfaces/Dal';
import { Note } from '../../constants/models/Note';

@injectable()
export class ControllerEdit implements Controller {
    private readonly dal: Dal;

    public constructor(
        @inject(Types.Dal)
        dal: Dal,
    ) {
        this.dal = dal;
    }

    public async control(req: Request, res: Response): Promise<void> {
        try {
            const style: string = req.session ? req.session.style : '';

            const note: Note = await this.dal.getNoteById(req.params.id);

            res.render('editNote.hbs', {
                title: 'Edit note',
                note,
                style,
            });
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
        }
    }
}
