import { Express, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { Routes } from '../interfaces/Routes';
import { Controller } from '../interfaces/Controller';
import { Types } from '../types/Types';
import { RequestType } from '../constants/enums/RequestType';

@injectable()
export class RoutesImpl implements Routes {
    private readonly controllerDefault: Controller;

    public constructor(
        @inject(Types.Controller)
        @named(RequestType.Default)
        controllerDefault: Controller,
    ) {
        this.controllerDefault = controllerDefault;
    }

    public init(app: Express): void {
        app.post('/', (req: Request, res: Response) =>
            this.controllerDefault.control(req, res),
        );
    }
}
