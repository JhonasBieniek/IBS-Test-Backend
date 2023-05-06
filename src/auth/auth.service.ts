import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/models/user.model';
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, } from 'firebase/auth';
import { setDoc, DocumentReference, doc, getDoc, DocumentSnapshot, DocumentData, } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


@Injectable()
export class AuthService {
    constructor(private firebaseService: FirebaseService) { }

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
        // return this.firebaseService.usersCollection.
    }
    // public async getAll(): Promise<any> {
    //     const response = await axios.get('https://your-firebase-database-url.firebaseio.com/your-collection.json');
    //     return response.data;
    // }
}
