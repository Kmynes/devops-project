import { 
  Controller, 
  Get, 
  Param, 
  Res, 
  Inject, 
  ForbiddenException, 
  NotFoundException
} from '@nestjs/common';
import { AssetsDTO } from './assets.dto';
import * as express from "express";
import * as fs from "fs";
import { promisify } from 'util';
import { resolve } from 'path';

const exists = promisify(fs.exists);

@Controller()
export class AppController {
  constructor(@Inject("PATH_CLIENT_ASSETS") private readonly path_client_assets:string,
    @Inject("CLIENT_ASSETS") private readonly client_assets:string[]) {}

  @Get("card-icon/:name")
  async getIcon(@Param() assets:AssetsDTO, @Res() res:express.Response) {
    const fileName = `${this.path_client_assets}/${assets.name}.png`;
    if (!this.client_assets.includes(`${assets.name}.png`))
      throw new ForbiddenException(`Unexpected assets [${assets.name}]`);

    const resolvedFile = resolve(fileName);
    if (!await exists(resolvedFile))
      throw new NotFoundException(`Unexpected error can't find file [${assets.name}]`);

    res.sendFile(resolvedFile);
  }
}
