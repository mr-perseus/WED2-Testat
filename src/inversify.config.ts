import { Container } from 'inversify';
import { Types } from './types/Types';
import { RoutesImpl } from './implementations/RoutesImpl';
import { Routes } from './interfaces/Routes';
import { ControllerDefault } from './implementations/ControllerDefault';
import { Controller } from './interfaces/Controller';
import { Dal } from './interfaces/Dal';
import { DalImpl } from './implementations/DalImpl';
import { RequestType } from './constants/enums/RequestType';

export const container = new Container();
container.bind<Routes>(Types.Routes).to(RoutesImpl);
container
    .bind<Controller>(Types.Controller)
    .to(ControllerDefault)
    .whenTargetNamed(RequestType.Default);
container.bind<Dal>(Types.Dal).to(DalImpl);
