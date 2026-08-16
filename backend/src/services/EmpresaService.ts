import {
  EmpresaRepository,
  Empresa,
} from "../repositories/EmpresaRepository";

export class EmpresaService {
  private repository = new EmpresaRepository();

  public async obtenerEmpresas(): Promise<Empresa[]> {
    return this.repository.obtenerEmpresas();
  }
}