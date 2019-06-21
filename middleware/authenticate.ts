import firebase from '@/plugins/firebase';
import attemitaModule from '@/store/attemita';
import { getModule } from 'vuex-module-decorators';

export default ({ route, redirect, store }): void => {

    if(process.server) return;
    const attemitaStore = getModule(attemitaModule, store);
    const routeName: string = route.name;

    console.log('[authenticate]', routeName);

    firebase.auth().onAuthStateChanged((user): void => {
        console.log('[authenticate]' , user ? user.uid : user);
        const isAuthed: boolean = user !== null;

        attemitaStore.setUser(user);

        if(routeName === 'login' && isAuthed) {
            return redirect('/');
        } else if (routeName !== 'login' && !isAuthed) {
            return redirect('/login');
        }
    });
};
