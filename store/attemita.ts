import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

@Module({ name: 'attemita', namespaced: true, stateFactory: true })
export default class AttemitaModule extends VuexModule {
    public hoge: string = 'test';

    @Mutation
    public changeHoge(): void {
        this.hoge = 'fuga';
    }
}
