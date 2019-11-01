import { Express, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { Routes } from '../interfaces/Routes';
import { Controller } from '../interfaces/Controller';
import { Types } from '../types/Types';
import { RequestType } from '../constants/enums/RequestType';

@injectable()
export class RoutesImpl implements Routes {
    private readonly controllerDefault: Controller;

    private readonly controllerCreate: Controller;

    private readonly controllerSave: Controller;

    private readonly controllerEdit: Controller;

    public constructor(
        @inject(Types.Controller)
        @named(RequestType.Default)
        controllerDefault: Controller,
        @inject(Types.Controller)
        @named(RequestType.Create)
        controllerCreate: Controller,
        @inject(Types.Controller)
        @named(RequestType.Save)
        controllerSave: Controller,
        @inject(Types.Controller)
        @named(RequestType.Edit)
        controllerEdit: Controller,
    ) {
        this.controllerDefault = controllerDefault;
        this.controllerCreate = controllerCreate;
        this.controllerSave = controllerSave;
        this.controllerEdit = controllerEdit;
    }

    public init(app: Express): void {
        app.get('/', (req: Request, res: Response) =>
            this.controllerDefault.control(req, res),
        );

        app.get('/create', (req: Request, res: Response) =>
            this.controllerCreate.control(req, res),
        );

        app.get('/save', (req: Request, res: Response) =>
            this.controllerSave.control(req, res),
        );

        app.get('/edit/:id', (req: Request, res: Response) =>
            this.controllerEdit.control(req, res),
        );
    }
}
