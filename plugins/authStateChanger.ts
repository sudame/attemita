import attemitaModule from '@/store/attemita';
import firebase from '@/plugins/firebase';
import { getModule } from 'vuex-module-decorators';

export default ({ store }): void => {
    const attemitaStore = getModule(attemitaModule, store);

    firebase.auth().onAuthStateChanged((user): void => {
        if(user === null) {
            console.log('[auth state change!] null');
            attemitaStore.setUser(null);
        } else {
            attemitaStore.setUser(user);
            console.log('[auth state change!] ' + user.uid);
        }
    });
};
