import { LoginRepository } from "../repositories/LoginRepository";

export class LoginService {

    private repository = new LoginRepository();

    public async loginUsuario(
        gmail: string,
        password: string
    ) {

        return await this.repository.loginUsuario(
            gmail,
            password
        );

    }

}