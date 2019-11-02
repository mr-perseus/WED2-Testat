import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller } from '../../interfaces/Controller';
import { Types } from '../../types/Types';
import { Dal } from '../../interfaces/Dal';
import { Note } from '../../constants/models/Note';
import { SortedBy } from '../../constants/enums/SortedBy';

import moment = require('moment');

interface SessionData {
    sortedBy: SortedBy;
    showFinished: boolean;
    isAscending: boolean;
    isDarkTheme: boolean;
}

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
            const sessionData: SessionData = ControllerDefault.createSession(
                req,
            );

            const { sortedBy, isAscending, showFinished } = sessionData;

            const notes: Note[] = await this.dal.getNotes(
                showFinished ? {} : { finished: false },
            );
            const sortedNotes: Note[] = this.getSortedNotes(
                notes,
                sortedBy,
                isAscending,
            );

            res.render('notes.hbs', {
                title: 'Notes',
                notes: sortedNotes,
                ...sessionData,
            });
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR);
            res.render('error.hbs', {
                message: error.message,
            });
        }
    }

    private static createSession(req: Request): SessionData {
        const { session } = req;

        if (!session) {
            throw new Error('session invalid');
        }

        if (!session.visited) {
            session.sortedBy = SortedBy.dueDate;
            session.showFinished = true;
            session.isAscending = true;
            session.isDarkTheme = true;
            session.visited = true;
        }

        if (req.query.sort) {
            session.sortedBy = req.query.sort;
            session.isAscending = !session.isAscending;
        }

        if (req.query.switchStyle) {
            session.isDarkTheme = !session.isDarkTheme;
        }

        if (req.query.switchShowFinished) {
            session.showFinished = !session.showFinished;
        }

        return {
            sortedBy: session.sortedBy,
            isAscending: session.isAscending,
            isDarkTheme: session.isDarkTheme,
            showFinished: session.showFinished,
        };
    }

    private getSortedNotes(
        notes: Note[],
        sortedBy: SortedBy,
        isAscending: boolean,
    ): Note[] {
        return notes.sort((a: Note, b: Note) => {
            let result: number;
            switch (sortedBy) {
                case SortedBy.createdDate:
                    result = moment(a.createdDate).isAfter(b.createdDate)
                        ? 1
                        : -1;
                    break;
                case SortedBy.dueDate:
                    result = moment(a.dueDate).isAfter(b.dueDate) ? 1 : -1;
                    break;
                case SortedBy.importance:
                    result = a.importance - b.importance;
                    break;
                default:
                    throw new Error(`Invalid sortedBy: ${sortedBy}`);
            }

            if (!isAscending) {
                result = -result;
            }

            return result;
        });
    }
}
