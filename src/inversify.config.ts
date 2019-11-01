import { Container } from 'inversify';
import { Types } from './types/Types';
import { RoutesImpl } from './implementations/RoutesImpl';
import { Routes } from './interfaces/Routes';
import { ControllerDefault } from './implementations/controllers/ControllerDefault';
import { Controller } from './interfaces/Controller';
import { Dal } from './interfaces/Dal';
import { DalImpl } from './implementations/DalImpl';
import { RequestType } from './constants/enums/RequestType';
import { ControllerEdit } from './implementations/controllers/ControllerEdit';
import { ControllerSave } from './implementations/controllers/ControllerSave';
import { ControllerCreate } from './implementations/controllers/ControllerCreate';

export const container = new Container();
container.bind<Routes>(Types.Routes).to(RoutesImpl);
container
    .bind<Controller>(Types.Controller)
    .to(ControllerDefault)
    .whenTargetNamed(RequestType.Default);
container
    .bind<Controller>(Types.Controller)
    .to(ControllerEdit)
    .whenTargetNamed(RequestType.Edit);
container
    .bind<Controller>(Types.Controller)
    .to(ControllerSave)
    .whenTargetNamed(RequestType.Save);
container
    .bind<Controller>(Types.Controller)
    .to(ControllerCreate)
    .whenTargetNamed(RequestType.Create);
container.bind<Dal>(Types.Dal).to(DalImpl);
