import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { query, doc, where, getDocs, deleteDoc, updateDoc, setDoc, DocumentReference } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AuthError } from 'firebase/auth';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
    constructor(
        private firebaseService: FirebaseService
    ) { }

    public async register(body: Omit<User, 'id'>): Promise<void> {
        try {
            const id: string = uuidv4();
            const docRef: DocumentReference = doc(
                this.firebaseService.usersCollection,
                id,
            );
            await setDoc(docRef, body);
        } catch (error: unknown) {
            const firebaseAuthError = error as AuthError;
            console.log(`[FIREBASE AUTH ERROR CODE]: ${firebaseAuthError.code}`);
            if (firebaseAuthError.code === 'auth/email-already-in-use') {
                throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
            }
        }
    }

    public async getAll(): Promise<Object> {
        let q = query(this.firebaseService.usersCollection);
        let querySnapshot = await getDocs(q);
        let allUsers: Object[] = [];
        querySnapshot.forEach((doc: any) => {
            allUsers.push(doc.data());
        });
        return allUsers;
    }

    public async getOne(id: string): Promise<Object> {
        let q = query(this.firebaseService.usersCollection, where("id", "==", id));
        let querySnapshot = await getDocs(q);
        let user = [];
        querySnapshot.forEach((doc: any) => {
            user = doc.data();
        });
        return user;
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
    }

}
