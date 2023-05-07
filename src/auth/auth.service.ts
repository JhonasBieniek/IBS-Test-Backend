import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/models/user.model';
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, } from 'firebase/auth';
import { setDoc, query, DocumentReference, doc, getDoc, DocumentSnapshot, DocumentData, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        private firebaseService: FirebaseService
    ) { }

    public async login(
        email: string,
        password: string,
    ): Promise<Omit<User, 'password'>> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                this.firebaseService.auth,
                email,
                password,
            );
            if (userCredential) {
                const id: string = userCredential.user.uid;
                const docRef: DocumentReference = doc(
                    this.firebaseService.usersCollection,
                    id,
                );
                const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);
                const loggedUser: User = {
                    ...snapshot.data(),
                    id: snapshot.id,
                } as User;
                delete loggedUser.password;
                return loggedUser;
            }
        } catch (error: unknown) {
            const firebaseAuthError = error as AuthError;

            console.log(`[FIREBASE AUTH ERROR CODE]: ${firebaseAuthError.code}`);

            if (firebaseAuthError.code === 'auth/wrong-password') {
                throw new HttpException(
                    'Email or password incorrect.',
                    HttpStatus.FORBIDDEN,
                );
            }

            if (firebaseAuthError.code === 'auth/user-not-found') {
                throw new HttpException('Email not found.', HttpStatus.NOT_FOUND);
            }
        }
    }

    public async register(body: Omit<User, 'id'>): Promise<void> {
        try {
            // const userCredential: UserCredential =
            //     await createUserWithEmailAndPassword(
            //         this.firebaseService.auth,
            //         body.email,
            //         body.password,
            //     );
            // if (userCredential) {
            // const id: string = userCredential.user.uid;
            const id: any = uuidv4();
            const docRef: DocumentReference = doc(
                this.firebaseService.usersCollection,
                id,
            );
            await setDoc(docRef, body);
            // }
        } catch (error: unknown) {
            const firebaseAuthError = error as AuthError;
            console.log(`[FIREBASE AUTH ERROR CODE]: ${firebaseAuthError.code}`);
            if (firebaseAuthError.code === 'auth/email-already-in-use') {
                throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
            }
        }
    }


    public async getAll(): Promise<any> {
        let q = query(this.firebaseService.usersCollection);
        let querySnapshot = await getDocs(q);
        let allUsers: Object[] = [{}];
        querySnapshot.forEach((doc: any) => {
            allUsers.push(doc.data());
        });
        return allUsers;
    }

    public async getOne(id: string): Promise<any> {
        let q = query(this.firebaseService.usersCollection, where("id", "==", id));
        let querySnapshot = await getDocs(q);
        let allUsers: Object[] = [{}];
        querySnapshot.forEach((doc: any) => {
            allUsers.push(doc.data());
        });
        return allUsers;
    }

    public async remove(id: string) {
        const querySnapshot = await getDocs(
            query(this.firebaseService.usersCollection, where('id', '==', id))
        );
        const documents = querySnapshot.docs;
        if (documents.length > 0) {
            const document = documents[0];
            const userDoc = doc(this.firebaseService.usersCollection, document.id);
            return deleteDoc(userDoc);
        }
        console.log("erro")
    }

    async update(id: string, user: any) {
        user['modified'] = new Date();
        const querySnapshot = await getDocs(
            query(this.firebaseService.usersCollection, where('id', '==', id))
        );
        const documents = querySnapshot.docs;
        if (documents.length > 0) {
            const document = documents[0];
            const userDoc = doc(this.firebaseService.usersCollection, document.id);
            return updateDoc(userDoc, user);
        }
        console.log("erro")
    }

}
