import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';
import * as firebase from 'firebase';
import { User, Person, Team } from '@/models';

@Module({ name: 'attemita', namespaced: true, stateFactory: true })
export default class AttemitaModule extends VuexModule {
  public user: User | null = null;
  public userPeople: Person[] = [];
  public teams: Team[] = [];
  public teamPeople: {string: Team[]} | {} = {};

  public get isAuthenticated(): boolean {
    return this.user !== null;
  }

  public get people(): Person[] {
    const teams: string[] = Object.keys(this.teamPeople);
    let people: Person[] = [];

    console.log(this.teamPeople);
    teams.forEach((team): void => {
      console.log(team, this.teamPeople[team]);
      people = people.concat(this.teamPeople[team]);
    });

    people = people.concat(this.userPeople);

    console.log(this.userPeople);

    return people;
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
    this.userPeople = people;
  }

  @Mutation
  public setTeams(teams: Team[]): void {
    this.teams = teams;
  }

  @Mutation
  public setTeamPeople({ teamID, people }: {teamID: string; people: Person[]}): void {
    Vue.set(this.teamPeople, teamID, people);
  }
}
