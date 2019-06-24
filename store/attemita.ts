import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import * as firebase from 'firebase';
import { User, Person, Team } from '@/models';

@Module({ name: 'attemita', namespaced: true, stateFactory: true })
export default class AttemitaModule extends VuexModule {
  public user: User | null = null;
  public people: Person[] = [];
  public teams: Team[] = [];

  public get isAuthenticated(): boolean {
    return this.user !== null;
  }

  @Mutation
  public setUser(user: firebase.User | null): void {
    if(user === null) {
      this.user = null;
      return;
    }
    this.user = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
    };
  }

  @Mutation
  public setPeople(people: Person[]): void {
    this.people = people;
  }

  @Mutation
  public setTeams(teams: Team[]): void {
    this.teams = teams;
  }
}
