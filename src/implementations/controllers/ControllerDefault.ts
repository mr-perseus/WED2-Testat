import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../../interfaces/Controller';
import { Types } from '../../types/Types';
import { Dal } from '../../interfaces/Dal';
import { Note } from '../../constants/models/Note';

@injectable()
export class ControllerDefault implements Controller {
    private readonly dal: Dal;

    public constructor(
        @inject(Types.Dal)
        dal: Dal,
    ) {
        this.dal = dal;
    }

    public async control(req: Request, res: Response): Promise<void> {
        try {
            const { session } = req;
            if (!session) { // TODO in separate method.
                throw new Error("session invalid");
            }
            console.log('sessin', session);
            const notes: Note[] = await this.dal.getNotes();
            res.render('notes.hbs', {
                title: 'Notes',
                notes,
                sort: session.sort,
                showFinished: !session.showFinished,
                orderValue: session.orderValue,
                style: session.style,
            });
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
        }
    }
}
